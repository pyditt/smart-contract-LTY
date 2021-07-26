import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from 'hardhat';
import { addLiquidityUtil, blockchainTimeTravel, deployUniswap, LEDGITY_DECIMALS, toTokens } from '../shared/utils';
import { Ledgity, MockUSDC, Reserve, UniswapV2Factory, UniswapV2Pair, UniswapV2Router02 } from '../typechain';
import UniswapV2PairArtifact from '../uniswap_build/contracts/UniswapV2Pair.json';
const { expect } = chai;

const INITIAL_TOTAL_SUPPLY = BigNumber.from('10').pow(BigNumber.from('26'));
const NUM_TOKENS_TO_SELL_LIQUIDITY = toTokens('5000');

describe('Ledgity', () => {
  let aliceAccount: SignerWithAddress, bobAccount: SignerWithAddress, charlieAccount: SignerWithAddress;
  let alice: string, bob: string, charlie: string;
  before(async () => {
    [aliceAccount, bobAccount, charlieAccount] = await ethers.getSigners();
    [alice, bob, charlie] = [aliceAccount, bobAccount, charlieAccount].map(account => account.address);
  });

  let token: Ledgity;
  let tokenReserve: Reserve;
  let factory: UniswapV2Factory;
  let usdcToken: MockUSDC;
  let router: UniswapV2Router02;
  before(async () => {
    ({ factory, router } = await deployUniswap(aliceAccount));
    usdcToken = await (await ethers.getContractFactory('MockUSDC')).deploy();
  });

  beforeEach(async () => {
    token = await (await ethers.getContractFactory('Ledgity')).deploy();
    tokenReserve = await (await ethers.getContractFactory('Reserve')).deploy(router.address, token.address, usdcToken.address);
    await token.initialize(router.address, tokenReserve.address, usdcToken.address);
  });

  async function getPair() {
    const pairAddress = await factory.getPair(token.address, usdcToken.address);
    return await ethers.getContractAt(UniswapV2PairArtifact.abi, pairAddress) as UniswapV2Pair;
  }

  async function getPairIndices(pair: UniswapV2Pair) {
    return await pair.token0() === token.address ? [0, 1] as const : [1, 0] as const;
  }

  async function addLiquidity(tokenAmount: BigNumberish, usdcAmount: BigNumberish) {
    await addLiquidityUtil(tokenAmount, usdcAmount, token, usdcToken, router, alice);
  }

  async function sell(tokenAmount: BigNumberish, from: SignerWithAddress) {
    await token.connect(from).approve(router.address, tokenAmount);
    await router.connect(from).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      tokenAmount,
      0, // accept any amount of USDC
      [token.address, usdcToken.address],
      from.address,
      Math.floor(Date.now() / 1000) + 3600,
    );
  }

  async function buy(usdcAmount: BigNumberish, from: SignerWithAddress) {
    const pair = await getPair();
    const [tokenIndex] = await getPairIndices(pair);
    const reservesBefore = await pair.getReserves();
    await usdcToken.mint(from.address, usdcAmount);
    await usdcToken.connect(from).approve(router.address, usdcAmount);
    await router.connect(from).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      usdcAmount,
      0, // accept any amount of USDC
      [usdcToken.address, token.address],
      from.address,
      Math.floor(Date.now() / 1000) + 3600,
    );
    // How many tokens bought(without the fee)?
    return reservesBefore[tokenIndex].sub((await pair.getReserves())[tokenIndex]);
  }

  describe('constructor', () => {
    it('should have correct token info', async () => {
      expect(await token.name()).to.eq('Ledgity', 'name');
      expect(await token.symbol()).to.eq('LTY', 'symbol');
      expect(await token.totalSupply()).to.eq(INITIAL_TOTAL_SUPPLY, 'initial total supply');
      expect(await token.decimals()).to.eq(LEDGITY_DECIMALS, 'decimals');
    });

    it('should send all supply to the owner', async () => {
      const balance = await token.balanceOf(alice);
      expect(balance).to.eq(INITIAL_TOTAL_SUPPLY, 'Initial supply not sent to the owner');
    });
  });

  describe('transfer', () => {
    it('should transfer tokens', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const bobBalanceBefore = await token.balanceOf(bob);
      const amount = toTokens('10');
      await token.transfer(bob, amount);
      expect(await token.balanceOf(alice)).to.eq(aliceBalanceBefore.sub(amount), 'Alice');
      expect(await token.balanceOf(bob)).to.eq(bobBalanceBefore.add(amount), 'Bob');
    });

    it('should emit Transfer event', async () => {
      const amount = toTokens('10');
      await expect(await token.transfer(bob, amount))
        .to.emit(token, 'Transfer')
        .withArgs(alice, bob, amount);
    });
  });

  describe('transfer: time limit', () => {
    it('should NOT allow two transfers from one account within 15 minutes', async () => {
      await token.transfer(bob, 1);
      await blockchainTimeTravel(async travel => {
        await travel(15 * 60 - 10);  // wait for <15 minutes
        await expect(token.transfer(charlie, 1))
          .to.be.revertedWith('Ledgity: only one transaction per 15 minutes');
      });
    });

    it('should allow two transfers from one account with interval greater than 15 minutes', async () => {
      await token.transfer(bob, 1);
      await blockchainTimeTravel(async travel => {
        await travel(15 * 60 + 1);  // wait for >15 minutes
        await token.transfer(charlie, 1);
      });
    });

    it('should allow two transfers from different accounts within 15 minutes', async () => {
      await token.transfer(bob, 1);
      await token.connect(bobAccount).transfer(charlie, 1);
      await token.connect(charlieAccount).transfer(alice, 1);
    });

    it('should not limit uniswap', async () => {
      await usdcToken.mint(alice, toTokens('100000', await usdcToken.decimals()));
      await addLiquidity('100', '100');
      await usdcToken.approve(router.address, 1000);
      await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(100, 1, [usdcToken.address, token.address], alice, Math.floor(Date.now() / 1000) + 3600);
      await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(100, 1, [usdcToken.address, token.address], alice, Math.floor(Date.now() / 1000) + 3600);
      await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(100, 1, [usdcToken.address, token.address], alice, Math.floor(Date.now() / 1000) + 3600);
    });
  });

  describe('transfer: max size', () => {
    beforeEach(async () => {
      await addLiquidity('10000', '1000');
    });

    it('should allow owner to transfer any amount of tokens', async () => {
      await token.transfer(bob, await token.balanceOf(alice));
    });

    it('should not allow transfers over 0.1% of the liquidity pool reserves if the sender is not the owner', async () => {
      await token.transfer(bob, await token.balanceOf(alice));

      const pair = await getPair();
      const [tokenIndex] = await getPairIndices(pair);
      for (const divisor of [10, 100, 1000]) {  // 10%, 1%, 0.1%
        const tokenReserve = (await pair.getReserves())[tokenIndex];
        await expect(
          token.connect(bobAccount).transfer(alice, tokenReserve.div(divisor))
        ).to.be.revertedWith('Ledgity: transaction size exceeded');
      }
    });

    it('should allow transfers less than 0.1% of the liquidity pool reserves', async () => {
      await token.transfer(bob, await token.balanceOf(alice));

      const pair = await getPair();
      const [tokenIndex] = await getPairIndices(pair);
      const tokenReserve = (await pair.getReserves())[tokenIndex];
      await token.connect(bobAccount).transfer(alice, tokenReserve.div(1001));
    });
  });

  describe('transfer: fees', () => {
    let pair: UniswapV2Pair;
    let reservesBefore: { 0: BigNumber, 1: BigNumber; };
    let tokenIndex: 0 | 1, usdcIndex: 0 | 1;
    beforeEach(async () => {
      await addLiquidity('1000', '100');
      pair = await getPair();
      reservesBefore = await pair.getReserves();
      [tokenIndex, usdcIndex] = await getPairIndices(pair);
    });

    it('should NOT charge fees when transferring tokens between users', async () => {
      const amount = toTokens('10');
      await token.transfer(bob, amount);
      expect(await token.balanceOf(bob)).to.eq(amount);

      const amount2 = toTokens('5');
      await token.connect(bobAccount).transfer(charlie, amount2);
      expect(await token.balanceOf(charlie)).to.eq(amount2);
    });

    it('should charge 6% fee when selling', async () => {
      const contractBalanceBefore = await token.balanceOf(token.address);
      const amount = toTokens('10');
      await sell(amount, aliceAccount);
      const reserves = await pair.getReserves();
      const feeInTokens = amount.mul(6).div(100);
      const distributionFeeInTokens = amount.mul(4).div(100);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens).sub(distributionFeeInTokens), 'token reserve');
      expect(reserves[usdcIndex]).to.be.lt(reservesBefore[usdcIndex], 'USDC reserve');
      expect(await token.balanceOf(token.address)).to.be.gte(contractBalanceBefore.add(feeInTokens), 'token balance');
    });

    it('should charge 6% + 15% fee when selling if token price is less than x10 IDO price', async () => {
      const contractBalanceBefore = await token.balanceOf(token.address);
      const amount = toTokens('10');
      await sell(amount, aliceAccount);
      const reserves = await pair.getReserves();
      const feeInTokens = amount.mul(6 + 15).div(100);
      const distributionFeeInTokens = amount.mul(4).div(100);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens).sub(distributionFeeInTokens), 'token reserve');
      expect(reserves[usdcIndex]).to.be.lt(reservesBefore[usdcIndex], 'USDC reserve');
      expect(await token.balanceOf(token.address)).to.be.gte(contractBalanceBefore.add(feeInTokens), 'token balance');
    });

    it('should distribute 4% of transferred tokens among holders when selling', async () => {
      // Alice - 10/20, Bob - 7/20, Charlie - 3/20
      const available = await token.balanceOf(alice);
      await token.transfer(bob, available.mul(7).div(20));
      await token.transfer(charlie, available.mul(3).div(20));
      expect(await token.balanceOf(alice)).to.eq(available.mul(10).div(20), 'sanity check');
      const aliceBalanceBefore = await token.balanceOf(alice);
      const bobBalanceBefore = await token.balanceOf(bob);
      const charlieBalanceBefore = await token.balanceOf(charlie);

      const amount = toTokens('10000');
      await sell(amount, aliceAccount);

      const tokensDistributed = amount.mul(4).div(100);
      const balancesSum = aliceBalanceBefore.add(bobBalanceBefore).add(charlieBalanceBefore);
      expect(await token.balanceOf(alice)).to.not.eq(aliceBalanceBefore, 'Alice before');
      expect(await token.balanceOf(alice)).to.closeTo(
        aliceBalanceBefore.sub(amount).add(tokensDistributed.mul(aliceBalanceBefore).div(balancesSum)),
        1,
        'Alice',
      );
      expect(await token.balanceOf(bob)).to.not.eq(bobBalanceBefore, 'Bob before');
      expect(await token.balanceOf(bob)).to.closeTo(
        bobBalanceBefore.add(tokensDistributed.mul(bobBalanceBefore).div(balancesSum)),
        1,
        'Bob',
      );
      expect(await token.balanceOf(charlie)).to.not.eq(charlieBalanceBefore, 'Charlie before');
      expect(await token.balanceOf(charlie)).to.closeTo(
        charlieBalanceBefore.add(tokensDistributed.mul(charlieBalanceBefore).div(balancesSum)),
        1,
        'Charlie',
      );
      expect(await token.balanceOf(token.address)).to.eq(amount.mul(4 + 6).div(100), 'token balance');
    });

    it('should charge 4% fee when buying', async () => {
      const contractBalanceBefore = await token.balanceOf(token.address);
      const aliceBalanceBefore = await token.balanceOf(alice);
      const usdcAmount = toTokens('10', await usdcToken.decimals());
      const boughtAmount = await buy(usdcAmount, aliceAccount);
      const reserves = await pair.getReserves();
      const feeInTokens = boughtAmount.mul(4).div(100);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex].sub(boughtAmount), 'token reserve');
      expect(reserves[usdcIndex]).to.eq(reservesBefore[usdcIndex].add(usdcAmount), 'USDC reserve');
      expect(await token.balanceOf(alice)).to.eq(aliceBalanceBefore.add(boughtAmount).sub(feeInTokens), 'Alice balance');
      expect(await token.balanceOf(token.address)).to.eq(contractBalanceBefore.add(feeInTokens), 'token balance');
    });

    it('should NOT charge fee when buying from The Reserve', async () => {
      // TODO
      expect.fail();
    });
  });

  describe('Uniswap liquidity', () => {
    beforeEach(async () => {
      await addLiquidity('10', '1');
    });

    async function triggerLiquify() {
      await token.transfer(bob, 1);
    }

    it('should NOT add liquidity if swapAndLiquify is disabled', async () => {
      expect.fail();
    });

    it('should NOT add liquidity until the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      await token.transfer(token.address, NUM_TOKENS_TO_SELL_LIQUIDITY.sub(await token.balanceOf(token.address)).sub(1));
      await triggerLiquify();

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex], 'token reserve');
      expect(reserves[usdcIndex]).to.eq(reservesBefore[usdcIndex], 'USDC reserve');
    });

    it('should add liquidity when the balance of the contract passes the predefined threshold', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();

      await token.transfer(tokenReserve.address, NUM_TOKENS_TO_SELL_LIQUIDITY);
      await token.transfer(token.address, NUM_TOKENS_TO_SELL_LIQUIDITY.sub(await token.balanceOf(token.address)));
      const balanceBeforeLiquify = await token.balanceOf(token.address);
      await triggerLiquify();

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex].add(balanceBeforeLiquify.mul(2)), 'token reserve');
      // Swap and liquify does not change USDC reserves in the liquidity pool.
      expect(reserves[usdcIndex]).to.eq(reservesBefore[usdcIndex], 'USDC reserve');
      // should not leave any extra USDC or tokens on the balances
      expect(await token.balanceOf(token.address)).to.eq('0', 'token token');
      expect(await token.balanceOf(tokenReserve.address)).eq('0', 'token The Reserve');
      expect(await usdcToken.balanceOf(token.address)).to.eq('0', 'USDC token');
      expect(await usdcToken.balanceOf(tokenReserve.address)).eq('0', 'USDC The Reserve');
    });
  });

  describe('transferFrom', () => {
    it('should emit Transfer event', async () => {
      await token.approve(bob, 10);
      await expect(token.connect(bobAccount).transferFrom(alice, charlie, 10))
        .to.emit(token, 'Transfer')
        .withArgs(alice, charlie, 10);
    });

    it('should emit Approval event', async () => {
      await expect(await token.approve(bob, 10)).to.emit(token, 'Approval').withArgs(alice, bob, 10);
      await expect(await token.approve(bob, 20)).to.emit(token, 'Approval').withArgs(alice, bob, 20);
      await expect(await token.connect(bobAccount).transferFrom(alice, charlie, 5)).to.emit(token, 'Approval').withArgs(alice, bob, 15);
      await expect(await token.increaseAllowance(bob, 10)).to.emit(token, 'Approval').withArgs(alice, bob, 25);
      await expect(await token.decreaseAllowance(bob, 20)).to.emit(token, 'Approval').withArgs(alice, bob, 5);
    });


    it('should approve tokens', async () => {
      await token.approve(bob, 10);
      expect(await token.allowance(alice, bob)).to.eq('10');
    });

    it('should transfer approved tokens', async () => {
      const aliceBalanceBefore = await token.balanceOf(alice);
      const amount = toTokens('10');
      await token.approve(charlie, amount);
      await token.connect(charlieAccount).transferFrom(alice, bob, amount);
      expect(await token.balanceOf(alice)).to.eq(aliceBalanceBefore.sub(amount), 'Alice');
      expect(await token.balanceOf(bob)).to.eq(amount, 'Bob');
    });

    it('should not transfer tokens when not approved', async () => {
      await expect(token.connect(charlieAccount).transferFrom(alice, bob, 10)).to.be.revertedWith('ReflectToken: transfer amount exceeds allowance');
    });

    it('should not transfer more tokens than approved', async () => {
      await token.approve(charlie, 10);
      await expect(token.connect(charlieAccount).transferFrom(alice, bob, 100)).to.be.revertedWith('ReflectToken: transfer amount exceeds allowance');
    });

    it('should reset allowance when transferred', async () => {
      await token.approve(charlie, 10);
      await token.connect(charlieAccount).transferFrom(alice, bob, 10);
      expect(await token.allowance(alice, charlie)).to.eq('0');
    });

    it('should decrease allowance when transferred less than allowance', async () => {
      await token.approve(charlie, 10);
      await token.connect(charlieAccount).transferFrom(alice, bob, 7);
      expect(await token.allowance(alice, charlie)).to.eq('3');
    });

    it('should increase allowance', async () => {
      await token.approve(charlie, 10);
      await token.increaseAllowance(charlie, 5);
      expect(await token.allowance(alice, charlie)).to.eq('15');
    });

    it('should decrease allowance', async () => {
      await token.approve(charlie, 10);
      await token.decreaseAllowance(charlie, 5);
      expect(await token.allowance(alice, charlie)).to.eq('5');
    });
  });

  describe('account exclusion', () => {
    it('by default accounts must not be excluded', async () => {
      expect(await token.isExcluded(alice)).to.eq(false);
      expect(await token.isExcluded(bob)).to.eq(false);
      expect(await token.isExcluded(token.address)).to.eq(false);
    });

    it('should exclude an account', async () => {
      await token.excludeAccount(bob);
      expect(await token.isExcluded(alice)).to.eq(false);
      expect(await token.isExcluded(bob)).to.eq(true);
    });

    it('should include an account', async () => {
      await token.excludeAccount(bob);
      expect(await token.isExcluded(bob)).to.eq(true);
      await token.includeAccount(bob);
      expect(await token.isExcluded(bob)).to.eq(false);
    });

    it('should only allow the owner to exclude and include an account', async () => {
      await token.excludeAccount(bob);
      await token.includeAccount(bob);
      await expect(token.connect(bobAccount).excludeAccount(charlie)).to.be.revertedWith('Ownable: caller is not the owner');
      await expect(token.connect(bobAccount).includeAccount(charlie)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
