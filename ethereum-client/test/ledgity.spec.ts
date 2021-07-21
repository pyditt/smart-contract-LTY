import { BN } from 'bn.js';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiBN from 'chai-bn';
import { LedgityInstance, MockUSDCInstance, UniswapV2FactoryInstance, UniswapV2PairInstance, UniswapV2Router02Instance } from '../types/truffle-contracts';
import { Transfer } from '../types/truffle-contracts/Ledgity';
import { blockchainTimeTravel, LEDGITY_DECIMALS, toTokens, ZERO_ADDRESS } from './utils';
const Ledgity = artifacts.require('Ledgity');
const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const UniswapV2Pair = artifacts.require('UniswapV2Pair');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');
const WETH = artifacts.require('WETH9');
const MockUSDC = artifacts.require('MockUSDC');

chai.use(chaiBN(BN));
chai.use(chaiAsPromised);

// Override `expect` because we use chai plugins
const expect = chai.expect;


const START_PRICE = new BN('100');
const INITIAL_TOTAL_SUPPLY = new BN('10').pow(new BN('26'));
const NUM_TOKENS_TO_SELL_LIQUIDITY = toTokens('5000');
/**
 * Transfer fee immediately after the contract is deployed.
 */
const INITIAL_FEE = new BN(30);

contract('Ledgity', (addresses) => {
  const [alice, bob, charlie] = addresses;

  let token: LedgityInstance;
  let factory: UniswapV2FactoryInstance;
  let usdcToken: MockUSDCInstance;
  let router: UniswapV2Router02Instance;

  before(async () => {
    factory = await UniswapV2Factory.new(ZERO_ADDRESS);
    const weth = await WETH.new();
    router = await UniswapV2Router02.new(factory.address, weth.address);
    usdcToken = await MockUSDC.new();
  });

  beforeEach(async () => {
    token = await Ledgity.new(router.address, { from: alice });
  });

  async function getPair() {
    const pairAddress = await factory.getPair(token.address, usdcToken.address);
    return await UniswapV2Pair.at(pairAddress);
  }

  async function getPairIndices(pair: UniswapV2PairInstance) {
    return await pair.token0() === token.address ? [0, 1] as const : [1, 0] as const;
  }

  it('should have correct token info', async () => {
    expect(await token.name()).to.eq('Ledgity');
    expect(await token.symbol()).to.eq('LTY');
    expect(await token.totalSupply()).to.bignumber.eq(INITIAL_TOTAL_SUPPLY);
    expect(await token.decimals()).to.bignumber.eq(LEDGITY_DECIMALS);
    expect(await token.getStartPrice()).to.bignumber.eq(START_PRICE);
  });

  it('should send all supply to the owner', async () => {
    const balance = await token.balanceOf(alice);
    expect(balance).to.bignumber.eq(INITIAL_TOTAL_SUPPLY, 'Initial supply not sent to the owner');
  });

  describe('transfer', () => {
    it('should transfer tokens', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const bobBalanceBefore = await token.balanceOf(bob);
      const amount = toTokens('10');
      await token.transfer(bob, amount, { from: alice });
      expect(await token.balanceOf(alice)).to.bignumber.gt(aliceBalanceBefore.sub(amount), 'Alice');  // including token distribution
      expect(await token.balanceOf(bob)).to.bignumber.gt(bobBalanceBefore, 'Bob');
    });

    it('should emit TransferEvent', async () => {
      const amount = toTokens('10');
      const res = await token.transfer(bob, amount);
      expect(res.logs.length).to.eq(1);
      const log = res.logs[0] as Truffle.TransactionLog<Transfer>;
      expect(log.event).to.eq('Transfer');
      expect(log.args.from).to.eq(alice);
      expect(log.args.to).to.eq(bob);
      expect(log.args.value).to.bignumber.eq(amount.sub(amount.mul(INITIAL_FEE).divn(100)));
    });

    it('should allow only one transfer per 15 minutes', async () => {
      await token.transfer(bob, toTokens('1'), { from: alice });
      await expect(
        token.transfer(charlie, toTokens('1'), { from: alice })
      ).to.eventually.be.rejectedWith(Error);
      await blockchainTimeTravel(async travel => {
        await travel(15 * 60 + 1);  // wait for >15 minutes
        await token.transfer(charlie, toTokens('1'), { from: alice });
      });
    });

    it('should allow owner to transfer any amount of tokens', async () => {
      await token.transfer(bob, await token.totalSupply(), { from: alice });
    });

    it('should not allow transfers over 0.1% of total supply if the sender is not the owner', async () => {
      await token.transfer(bob, await token.totalSupply(), { from: alice });

      for (const divisor of [10, 100, 1000]) {  // 10%, 1%, 0.1%
        const totalSupply = await token.totalSupply();
        await expect(
          token.transfer(alice, totalSupply.divn(divisor), { from: bob })
        ).to.eventually.be.rejectedWith(Error, undefined, `divisor: ${divisor}`);
      }
    });

    it('should allow transfers less than 0.1% of total supply', async () => {
      await token.transfer(bob, await token.totalSupply(), { from: alice });
      const totalSupply = await token.totalSupply();
      await token.transfer(alice, totalSupply.divn(1001), { from: bob });
    });
  });

  describe('transfer between users fee', () => {
    it('should not charge fees when transferring tokens between users', async () => {
      const amount = toTokens('10');
      await token.transfer(bob, amount, { from: alice });
      expect(await token.balanceOf(bob)).to.bignumber.eq(amount);

      const amount2 = toTokens('5');
      await token.transfer(charlie, amount2, { from: bob });
      expect(await token.balanceOf(charlie)).to.bignumber.eq(amount2);
    });
  });

  describe('dex selling fee', () => {
    beforeEach(async () => {
      // Add some token/USDC liquidity
      const tokenAmount = toTokens('10');
      const usdcAmount = toTokens('1', await usdcToken.decimals());
      await token.approve(router.address, tokenAmount, { from: alice });
      await usdcToken.mint(alice, usdcAmount);
      await usdcToken.approve(router.address, usdcAmount, { from: alice });
      await router.addLiquidity(token.address, usdcToken.address, tokenAmount, usdcAmount, 0, 0, ZERO_ADDRESS, Math.floor(Date.now() / 1000) + 3600, { from: alice });
    });

    async function testFee(account: string, fee: number) {
      const amount = toTokens('10');
      if (account !== alice) {
        await token.transfer(account, amount, { from: alice });
      }

      const pair = await getPair();
      const reservesBefore = await pair.getReserves();
      const accountBalanceBefore = await token.balanceOf(account);

      await token.approve(router.address, amount, { from: account });
      await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amount,
        0, // accept any amount of USDC
        [token.address, usdcToken.address],
        account,
        Math.floor(Date.now() / 1000) + 3600,
        { from: account }
      );
      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      const feeInTokens = amount.muln(fee).divn(100);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens), 'token reserve');
      expect(reserves[usdcIndex]).to.bignumber.lt(reservesBefore[usdcIndex], 'USDC reserve');

      const tokensDistributed = feeInTokens.divn(3);
      const accountBalance = await token.balanceOf(account);
      const accountBalanceExpectedOffByOne = accountBalanceBefore.sub(amount).add(tokensDistributed);
      // TODO: uncomment
      // TODO: is it possible to avoid off-by-one errors when calculating the balance of a user?
      // expect((accountBalance.sub(accountBalanceExpectedOffByOne)).abs()).to.bignumber.lte(
      //   new BN('1'),
      //   `account balance, ${accountBalance.toString()} | ${accountBalanceExpectedOffByOne.toString()}`,
      // )
    }

    it('should sell with no fee if the seller is the contract owner', async () => {
      await token.setPrice(START_PRICE.divn(6), { from: alice });
      await testFee(alice, 0);
    });

    it('should sell with 50% fee if price < x5 IDO price', async () => {
      await token.setPrice(START_PRICE.divn(6), { from: alice });
      await testFee(bob, 50);
    });

    for (const multiplier of [6, 9]) {
      it(`should sell with 30% fee if token price between x5 and x10 IDO price: x${multiplier}`, async () => {
        await token.setPrice(START_PRICE.muln(multiplier), { from: alice });
        await testFee(bob, 30);
      });
    }

    it('should sell with 10% fee if current supply is >50% and price is >x10 than IDO price', async () => {
      // burn <50%
      await token.burn(INITIAL_TOTAL_SUPPLY.divn(2).subn(1), { from: alice });
      await token.setPrice(START_PRICE.muln(11), { from: alice });
      await testFee(bob, 10);
    });

    it('should sell with 5% fee if current supply is between 30% and 50%', async () => {
      // burn <70%
      await token.burn(INITIAL_TOTAL_SUPPLY.muln(70).divn(100).subn(1), { from: alice });
      await testFee(bob, 5);
    });

    it('should sell with 2% fee if current supply is between 25% and 30%', async () => {
      // burn <75%
      await token.burn(INITIAL_TOTAL_SUPPLY.muln(75).divn(100).subn(1), { from: alice });
      await testFee(bob, 2);
    });
  });

  describe('transfer fee distribution', () => {
    const [sender, recipient, holder1, holder2, holder3] = addresses;
    beforeEach(async () => {
      // Burn <50% of tokens and set the price to x11 relative to IDO price to set the fee to 10%
      await token.burn(INITIAL_TOTAL_SUPPLY.divn(2).subn(1), { from: sender });
      await token.setPrice(START_PRICE.muln(11), { from: sender });
    });

    /// Send tokens to holders, expecting their balances to match amounts.
    async function sendTokensToHolders(amount1: BN, amount2: BN, amount3: BN) {
      // 10% fee
      amount3 = amount3.add(amount3.divn(10));
      // amount distributes from transfer to holder3 (/ 10(fee) / 3(parts) / 2(holders))
      const amount3TransferDistribution = amount3.divn(10 * 3 * 2);
      amount2 = amount2.add(amount2.divn(10)).sub(amount3TransferDistribution);  // 10% fee - distribution amount
      // amount distributes from transfer to holder3 (/ 10(fee) / 3(parts) / 1(holder))
      const amount2TransferDistribution = amount2.divn(10 * 3);
      amount1 = amount1.add(amount1.divn(10)).sub(amount3TransferDistribution).sub(amount2TransferDistribution);  // 10% fee - distribution amount
      await blockchainTimeTravel(async travel => {
        await token.transfer(holder1, amount1, { from: sender });
        await travel(16 * 60);
        await token.transfer(holder2, amount2, { from: sender });
        await travel(16 * 60);
        await token.transfer(holder3, amount3, { from: sender });
      });
      // Sanity checks
      expect(await token.balanceOf(holder1)).to.bignumber.eq(amount1);
      expect(await token.balanceOf(holder2)).to.bignumber.eq(amount2);
      expect(await token.balanceOf(holder3)).to.bignumber.eq(amount3);
    }

    it('should burn 1/3 of fee', async () => {
      const totalSupplyBefore = await token.totalSupply();
      const totalBurnedBefore = await token.totalBurn();
      await token.transfer(recipient, toTokens('90'), { from: sender });
      const expectBurned = toTokens('3');  // 90 * 0.1 / 3
      expect(await token.totalSupply()).to.bignumber.eq(totalSupplyBefore.sub(expectBurned), 'supply');
      expect(await token.totalBurn()).to.bignumber.eq(totalBurnedBefore.add(expectBurned), 'burned');
    });

    // TODO: FIXME and enable
    it.skip('should distribute 1/3 of fee between holders in proportion', async () => {
      await sendTokensToHolders(toTokens('15'), toTokens('4'), toTokens('1'));
      const amount = toTokens('10');
      await token.transfer(recipient, amount, { from: sender });
      // The 1/3 of fee must be split in "15 : 4 : 1" proportion
      const distributed = amount.divn(10 * 3);  // 1/3 of 10% fee
      expect(await token.balanceOf(holder1)).to.bignumber.eq(toTokens('15').add(distributed.muln(15).divn(20)));
      expect(await token.balanceOf(holder2)).to.bignumber.eq(toTokens('4').add(distributed.muln(4).divn(20)));
      expect(await token.balanceOf(holder3)).to.bignumber.eq(toTokens('1').add(distributed.muln(1).divn(20)));
    });

    // TODO: FIXME and enable
    it.skip('should not distribute tokens between excluded holders', async () => {
      await sendTokensToHolders(toTokens('15'), toTokens('5'), toTokens('100'));
      await token.excludeAccount(holder3);
      const amount = toTokens('10');
      await token.transfer(recipient, amount, { from: sender });
      // The 1/3 of fee must be split in "15 : 5" proportion (holder with 100 tokens is excluded)
      const distributed = amount.divn(10 * 3);  // 1/3 of 10% fee
      expect(await token.balanceOf(holder1)).to.bignumber.eq(toTokens('15').add(distributed.muln(15).divn(20)));
      expect(await token.balanceOf(holder2)).to.bignumber.eq(toTokens('5').add(distributed.muln(5).divn(20)));
      // unchanged
      expect(await token.balanceOf(holder3)).to.bignumber.eq(toTokens('100'));
    });
  });

  describe('Uniswap liquidity', () => {
    beforeEach(async () => {
      // Add some token/USDC liquidity
      const tokenAmount = toTokens('10');
      const usdcAmount = toTokens('1', await usdcToken.decimals());
      await token.approve(router.address, tokenAmount, { from: alice });
      await usdcToken.mint(alice, usdcAmount);
      await usdcToken.approve(router.address, usdcAmount, { from: alice });
      await router.addLiquidity(token.address, usdcToken.address, tokenAmount, usdcAmount, 0, 0, ZERO_ADDRESS, Math.floor(Date.now() / 1000) + 3600, { from: alice });

      expect(await token.balanceOf(token.address)).to.bignumber.eq('0', 'sanity check');

      // Transfer tokens to Bob, because the owner of the contract (Alice) is excluded from fees.
      await token.transfer(bob, (await token.maxTokenTx()).subn(1), { from: alice });
    });

    async function triggerLiquify() {
      await token.transfer(alice, 1, { from: bob });
    }

    it('should accumulate tokens for adding liquidity', async () => {
      const amount = toTokens('1');
      await token.transfer(alice, amount, { from: bob });
      const feeInTokens = amount.mul(INITIAL_FEE).divn(100);
      expect(await token.balanceOf(token.address)).to.bignumber.eq(feeInTokens.divn(3));
    });

    it('should not add liquidity until the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      // amount * fee / 100 / 3 = threshold
      // amount = threshold / fee * 100 * 3
      const amount = NUM_TOKENS_TO_SELL_LIQUIDITY.div(INITIAL_FEE).muln(300);
      await token.transfer(alice, amount, { from: bob });
      await triggerLiquify();

      const reserves = await pair.getReserves();
      expect(reserves[0]).to.bignumber.eq(reservesBefore[0], '0');
      expect(reserves[1]).to.bignumber.eq(reservesBefore[1], '1');
    });

    it('should add liquidity when the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      const amount = NUM_TOKENS_TO_SELL_LIQUIDITY.div(INITIAL_FEE).muln(300).addn(200);
      await token.transfer(alice, amount, { from: bob });
      const balanceBeforeLiquify = await token.balanceOf(token.address);
      expect(balanceBeforeLiquify).to.bignumber.gte(NUM_TOKENS_TO_SELL_LIQUIDITY, 'not enough tokens');
      await triggerLiquify();

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.bignumber.gt(reservesBefore[tokenIndex].add(balanceBeforeLiquify.divn(2)), 'token');
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex], 'USDC');
      // should not leave any extra USDC on the contract balance
      expect(token.balanceOf(token.address)).to.bignumber.eq('0', 'token');
      expect(usdcToken.balanceOf(token.address)).to.bignumber.eq('0', 'usdc');
    });
  });

  describe('transferFrom', () => {
    it('should approve tokens', async () => {
      await token.approve(bob, 10, { from: alice });
      expect(await token.allowance(alice, bob)).to.bignumber.eq('10');
    });

    it('should transfer approved tokens', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const amount = toTokens('10');
      await token.approve(charlie, amount, { from: alice });
      await token.transferFrom(alice, bob, amount, { from: charlie });
      expect(await token.balanceOf(alice)).to.bignumber.gt(aliceBalanceBefore.sub(amount), 'Alice');  // token distribution
      expect(await token.balanceOf(bob)).to.bignumber.gt(amount, 'Bob');
    });

    it('should not transfer tokens when not approved', async () => {
      await expect(token.transferFrom(alice, bob, 10, { from: charlie })).to.eventually.be.rejectedWith(Error);
    });

    it('should not transfer more tokens than approved', async () => {
      await token.approve(charlie, 10, { from: alice });
      await expect(token.transferFrom(alice, bob, 100, { from: charlie })).to.eventually.be.rejectedWith(Error);
    });

    it('should reset allowance when transferred', async () => {
      await token.approve(charlie, 10, { from: alice });
      await token.transferFrom(alice, bob, 10, { from: charlie });
      expect(await token.allowance(alice, charlie)).to.bignumber.eq('0');
    });

    it('should decrease allowance when transferred less than allowance', async () => {
      await token.approve(charlie, 10, { from: alice });
      await token.transferFrom(alice, bob, 7, { from: charlie });
      expect(await token.allowance(alice, charlie)).to.bignumber.eq('3');
    });

    it('should increase allowance', async () => {
      await token.approve(charlie, 10, { from: alice });
      await token.increaseAllowance(charlie, 5, { from: alice });
      expect(await token.allowance(alice, charlie)).to.bignumber.eq('15');
    });

    it('should decrease allowance', async () => {
      await token.approve(charlie, 10, { from: alice });
      await token.decreaseAllowance(charlie, 5, { from: alice });
      expect(await token.allowance(alice, charlie)).to.bignumber.eq('5');
    });
  });

  describe('account exclusion', () => {
    it('by default accounts must not be excluded', async () => {
      expect(await token.isExcluded(alice)).to.eq(false);
      expect(await token.isExcluded(bob)).to.eq(false);
    });

    it('should exclude an account', async () => {
      await token.excludeAccount(bob);
      expect(await token.isExcluded(alice)).to.eq(false);
      expect(await token.isExcluded(bob)).to.eq(true);
    });

    it('should include an account', async () => {
      await token.excludeAccount(bob, { from: alice });
      expect(await token.isExcluded(bob)).to.eq(true);
      await token.includeAccount(bob, { from: alice });
      expect(await token.isExcluded(bob)).to.eq(false);
    });

    it('should only allow the owner to exclude and include an account', async () => {
      await token.excludeAccount(bob, { from: alice });
      await token.includeAccount(bob, { from: alice });
      expect(token.excludeAccount(charlie, { from: bob })).to.eventually.be.rejectedWith(Error, undefined, 'Bob exclude');
      expect(token.includeAccount(charlie, { from: bob })).to.eventually.be.rejectedWith(Error, undefined, 'Bob include');
    });
  });
});
