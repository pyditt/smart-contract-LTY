import { BN } from 'bn.js';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiBN from 'chai-bn';
import { LedgityInstance, MockUSDCInstance, ReserveInstance, UniswapV2FactoryInstance, UniswapV2PairInstance, UniswapV2Router02Instance } from '../types/truffle-contracts';
import { Transfer } from '../types/truffle-contracts/Ledgity';
import { addLiquidityUtil, blockchainTimeTravel, LEDGITY_DECIMALS, toTokens, ZERO_ADDRESS } from './utils';
const Ledgity = artifacts.require('Ledgity');
const Reserve = artifacts.require('Reserve');
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

contract('Ledgity', (addresses) => {
  const [alice, bob, charlie] = addresses;

  let token: LedgityInstance;
  let tokenReserve: ReserveInstance;
  let factory: UniswapV2FactoryInstance;
  let usdcToken: MockUSDCInstance;
  let router: UniswapV2Router02Instance;

  before(async () => {
    factory = await UniswapV2Factory.new(ZERO_ADDRESS);
    const weth = await WETH.new();
    router = await UniswapV2Router02.new(factory.address, weth.address);
    usdcToken = await MockUSDC.new();
    // TODO: how to pass token address to the reserve?
    tokenReserve = await Reserve.new(router.address, ZERO_ADDRESS, usdcToken.address);
  });

  beforeEach(async () => {
    token = await Ledgity.new({ from: alice });
  });

  async function getPair() {
    const pairAddress = await factory.getPair(token.address, usdcToken.address);
    return await UniswapV2Pair.at(pairAddress);
  }

  async function getPairIndices(pair: UniswapV2PairInstance) {
    return await pair.token0() === token.address ? [0, 1] as const : [1, 0] as const;
  }

  async function addLiquidity(tokenAmount: string, usdcAmount: string) {
    await addLiquidityUtil(tokenAmount, usdcAmount, token, usdcToken, router, alice);
  }

  async function sell(tokenAmount: BN, from: string) {
    await token.approve(router.address, tokenAmount, { from });
    await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
      tokenAmount,
      0, // accept any amount of USDC
      [token.address, usdcToken.address],
      from,
      Math.floor(Date.now() / 1000) + 3600,
      { from }
    );
  }

  async function buy(usdcAmount: BN, from: string) {
    const pair = await getPair();
    const [tokenIndex] = await getPairIndices(pair);
    const reservesBefore = await pair.getReserves();
    await usdcToken.mint(from, usdcAmount);
    await usdcToken.approve(router.address, usdcAmount, { from });
    await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
      usdcAmount,
      0, // accept any amount of USDC
      [usdcToken.address, token.address],
      from,
      Math.floor(Date.now() / 1000) + 3600,
      { from }
    );
    // How many tokens bought(without the fee)?
    return reservesBefore[tokenIndex].sub((await pair.getReserves())[tokenIndex]);
  }

  describe('constructor', () => {
    it('should have correct token info', async () => {
      expect(await token.name()).to.eq('Ledgity', 'name');
      expect(await token.symbol()).to.eq('LTY', 'symbol');
      expect(await token.totalSupply()).to.bignumber.eq(INITIAL_TOTAL_SUPPLY, 'initial total supply');
      expect(await token.decimals()).to.bignumber.eq(LEDGITY_DECIMALS, 'decimals');
    });

    it('should send all supply to the owner', async () => {
      const balance = await token.balanceOf(alice);
      expect(balance).to.bignumber.eq(INITIAL_TOTAL_SUPPLY, 'Initial supply not sent to the owner');
    });
  });

  describe('transfer', () => {
    it('should transfer tokens', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const bobBalanceBefore = await token.balanceOf(bob);
      const amount = toTokens('10');
      await token.transfer(bob, amount, { from: alice });
      expect(await token.balanceOf(alice)).to.bignumber.eq(aliceBalanceBefore.sub(amount), 'Alice');
      expect(await token.balanceOf(bob)).to.bignumber.eq(bobBalanceBefore.add(amount), 'Bob');
    });

    it('should emit Transfer event', async () => {
      const amount = toTokens('10');
      const res = await token.transfer(bob, amount);
      expect(res.logs.length).to.eq(1);
      const log = res.logs[0] as Truffle.TransactionLog<Transfer>;
      expect(log.event).to.eq('Transfer');
      expect(log.args.from).to.eq(alice);
      expect(log.args.to).to.eq(bob);
      expect(log.args.value).to.bignumber.eq(amount);
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
  });

  describe('transfer: max size', () => {
    beforeEach(async () => {
      await addLiquidity('10000', '1000');
    });

    it('should allow owner to transfer any amount of tokens', async () => {
      await token.transfer(bob, await token.balanceOf(alice), { from: alice });
    });

    it('should not allow transfers over 0.1% of the liquidity pool reserves if the sender is not the owner', async () => {
      await token.transfer(bob, await token.balanceOf(alice), { from: alice });

      const pair = await getPair();
      const [tokenIndex] = await getPairIndices(pair);
      for (const divisor of [10, 100, 1000]) {  // 10%, 1%, 0.1%
        const tokenReserve = (await pair.getReserves())[tokenIndex];
        await expect(
          token.transfer(alice, tokenReserve.divn(divisor), { from: bob })
        ).to.eventually.be.rejectedWith(Error, undefined, `divisor: ${divisor}`);
      }
    });

    it('should allow transfers less than 0.1% of the liquidity pool reserves', async () => {
      await token.transfer(bob, await token.balanceOf(alice), { from: alice });

      const pair = await getPair();
      const [tokenIndex] = await getPairIndices(pair);
      const tokenReserve = (await pair.getReserves())[tokenIndex];
      await token.transfer(alice, tokenReserve.divn(1001), { from: bob });
    });
  });

  describe('transfer: fees', () => {
    let pair: UniswapV2PairInstance;
    let reservesBefore: { 0: BN, 1: BN; };
    let tokenIndex: 0 | 1, usdcIndex: 0 | 1;
    beforeEach(async () => {
      await addLiquidity('1000', '100');
      pair = await getPair();
      reservesBefore = await pair.getReserves();
      [tokenIndex, usdcIndex] = await getPairIndices(pair);
    });

    it('should NOT charge fees when transferring tokens between users', async () => {
      const amount = toTokens('10');
      await token.transfer(bob, amount, { from: alice });
      expect(await token.balanceOf(bob)).to.bignumber.eq(amount);

      const amount2 = toTokens('5');
      await token.transfer(charlie, amount2, { from: bob });
      expect(await token.balanceOf(charlie)).to.bignumber.eq(amount2);
    });

    it('should charge 6% fee when selling', async () => {
      const amount = toTokens('10');
      await sell(amount, alice);
      const reserves = await pair.getReserves();
      const feeInTokens = amount.muln(6).divn(100);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens), 'token reserve');
      expect(reserves[usdcIndex]).to.bignumber.lt(reservesBefore[usdcIndex], 'USDC reserve');
      expect(await token.balanceOf(token.address)).to.bignumber.eq(feeInTokens, 'token balance');
    });

    it('should charge 6% + 15% fee when selling if token price is less than x10 IDO price', async () => {
      const amount = toTokens('10');
      await sell(amount, alice);
      const reserves = await pair.getReserves();
      const feeInTokens = amount.muln(6 + 15).divn(100);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens), 'token reserve');
      expect(reserves[usdcIndex]).to.bignumber.lt(reservesBefore[usdcIndex], 'USDC reserve');
      expect(await token.balanceOf(token.address)).to.bignumber.eq(feeInTokens, 'token balance');
    });

    it('should distribute 4% of transferred tokens among holders when selling', async () => {
      await token.transfer(bob, toTokens('15'), { from: alice });
      await token.transfer(charlie, toTokens('5'), { from: alice });
      const aliceBalanceBefore = await token.balanceOf(alice);
      const bobBalanceBefore = await token.balanceOf(bob);
      const charlieBalanceBefore = await token.balanceOf(charlie);

      const amount = toTokens('10');
      await sell(amount, alice);

      const tokensDistributed = amount.muln(4).divn(100);
      const balancesSum = aliceBalanceBefore.add(bobBalanceBefore).add(charlieBalanceBefore);
      expect(await token.balanceOf(alice)).to.bignumber.closeTo(
        aliceBalanceBefore.sub(amount).add(tokensDistributed.mul(aliceBalanceBefore).div(balancesSum)),
        '1',
        'Alice',
      );
      expect(await token.balanceOf(bob)).to.bignumber.closeTo(
        bobBalanceBefore.add(tokensDistributed.mul(bobBalanceBefore).div(balancesSum)),
        '1',
        'Bob',
      );
      expect(await token.balanceOf(charlie)).to.bignumber.closeTo(
        charlieBalanceBefore.add(tokensDistributed.mul(charlieBalanceBefore).div(balancesSum)),
        '1',
        'Charlie',
      );
    });

    it('should charge 4% fee when buying', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const usdcAmount = toTokens('10', await usdcToken.decimals());
      const boughtAmount = await buy(usdcAmount, alice);
      const reserves = await pair.getReserves();
      const feeInTokens = boughtAmount.muln(4).divn(100);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].sub(boughtAmount), 'token reserve');
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex].add(usdcAmount), 'USDC reserve');
      expect(await token.balanceOf(alice)).to.bignumber.eq(aliceBalanceBefore.add(boughtAmount).sub(feeInTokens), 'Alice balance');
      expect(await token.balanceOf(token.address)).to.bignumber.eq(feeInTokens, 'token balance');
    });

    it('should NOT charge fee when buying from The Reserve', async () => {
      // TODO
      expect.fail();
    });
  });

  describe('Uniswap liquidity', () => {
    beforeEach(async () => {
      await addLiquidity('10', '1');
      expect(await token.balanceOf(token.address)).to.bignumber.eq('0', 'sanity check');

      // Transfer tokens to Bob, because the owner of the contract (Alice) is excluded from fees.
      await token.transfer(bob, (await token.maxTokenTx()).subn(1), { from: alice });
    });

    async function triggerLiquify() {
      await token.transfer(alice, 1, { from: bob });
    }

    it('should NOT add liquidity if swapAndLiquify is disabled', async () => {
      expect.fail();
    });

    it('should NOT add liquidity until the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      await token.transfer(token.address, NUM_TOKENS_TO_SELL_LIQUIDITY.subn(1), { from: alice });
      await triggerLiquify();

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex], 'token reserve');
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex], 'USDC reserve');
    });

    it('should add liquidity when the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      await token.transfer(tokenReserve.address, NUM_TOKENS_TO_SELL_LIQUIDITY, { from: alice });
      await token.transfer(token.address, NUM_TOKENS_TO_SELL_LIQUIDITY, { from: alice });
      const balanceBeforeLiquify = await token.balanceOf(token.address);
      await triggerLiquify();

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].add(balanceBeforeLiquify.muln(2)), 'token reserve');
      // Swap and liquify does not change USDC reserves in the liquidity pool.
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex], 'USDC reserve');
      // should not leave any extra USDC or tokens on the balances
      expect(await token.balanceOf(token.address)).to.bignumber.eq('0', 'token token');
      expect(await token.balanceOf(tokenReserve.address)).bignumber.eq('0', 'token The Reserve');
      expect(await usdcToken.balanceOf(token.address)).to.bignumber.eq('0', 'USDC token');
      expect(await usdcToken.balanceOf(tokenReserve.address)).bignumber.eq('0', 'USDC The Reserve');
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
