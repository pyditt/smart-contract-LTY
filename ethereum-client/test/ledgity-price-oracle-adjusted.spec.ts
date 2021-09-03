// Changes relative to `ledgity-price-oracle.spec.ts` are marked with XXX

import { parseUnits } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, BigNumberish } from 'ethers';
import { ethers } from 'hardhat';
import { deployUniswap, evmIncreaseTime, getBlockTimestamp, NON_ZERO_ADDRESS, snapshottedBeforeEach, toTokens, ZERO_ADDRESS } from '../shared/utils';
import { IERC20, Ledgity, LedgityPriceOracle, LedgityPriceOracleAdjusted, MockUSDC, UniswapV2Factory, UniswapV2Pair, UniswapV2Router02 } from '../typechain';
import UniswapV2PairArtifact from '../uniswap_build/contracts/UniswapV2Pair.json';


const PERIOD = 12 * 60 * 60;  // 12 hours
const INITIAL_LIQUIDITY = [toTokens('40000000'), toTokens('160000', 6)] as const;  // 1 : 10 price
const RECORDED_INITIAL_PRICE = 8425;

describe('LedgityPriceOracleAdjusted', () => {
  let aliceAccount: SignerWithAddress, bobAccount: SignerWithAddress;
  let alice: string, bob: string;
  before(async () => {
    [aliceAccount, bobAccount] = await ethers.getSigners();
    [alice, bob] = [aliceAccount].map(account => account.address);
  });

  // XXX
  let firstOracle: LedgityPriceOracle;
  let adjustedOracle: LedgityPriceOracleAdjusted;
  let token: Ledgity;
  let usdc: MockUSDC;
  let usdcDecimals: number;
  let factory: UniswapV2Factory;
  let router: UniswapV2Router02;
  let pair: UniswapV2Pair;
  let tokenIndex: 0 | 1;
  snapshottedBeforeEach(async () => {
    ({ factory, router } = await deployUniswap(aliceAccount));
    usdc = await (await ethers.getContractFactory('MockUSDC')).deploy();
    usdc.mint(alice, toTokens('10000000000000'));
    usdcDecimals = await usdc.decimals();
    token = await (await ethers.getContractFactory('Ledgity')).deploy();
    const reserve = await (await ethers.getContractFactory('Reserve')).deploy(router.address, token.address, usdc.address, NON_ZERO_ADDRESS);
    await token.initializeReserve(reserve.address);
    pair = await ethers.getContractAt(UniswapV2PairArtifact.abi, await factory.getPair(token.address, usdc.address)) as UniswapV2Pair;
    tokenIndex = await pair.token0() === token.address ? 0 : 1;
    // XXX simulate what happened on mainnet
    await addLiquidity(INITIAL_LIQUIDITY[0], INITIAL_LIQUIDITY[1]);
    await swap(toTokens('72320', usdcDecimals), usdc, token, aliceAccount);
    firstOracle = await (await ethers.getContractFactory('LedgityPriceOracle')).deploy(pair.address);
    await token.initializePriceOracle(firstOracle.address);
    expect(await token.initialPrice()).to.eq(RECORDED_INITIAL_PRICE);
    // Redeploy oracle with adjusted price calculations
    adjustedOracle = await (await ethers.getContractFactory('LedgityPriceOracleAdjusted')).deploy(pair.address);
    await token.initializePriceOracle(adjustedOracle.address);
  });

  async function addLiquidity(tokenAmount: BigNumberish, usdcAmount: BigNumberish, from = aliceAccount) {
    await token.connect(from).approve(router.address, tokenAmount);
    await usdc.connect(from).approve(router.address, usdcAmount);
    await router.connect(from).addLiquidity(
      token.address, usdc.address,
      tokenAmount, usdcAmount, 0, 0,
      ZERO_ADDRESS, await getBlockTimestamp() + 3600,
    );
  }

  async function swap(amount: BigNumberish, tokenIn: IERC20, tokenOut: IERC20, from: SignerWithAddress) {
    await tokenIn.connect(from).approve(router.address, amount);
    await router.connect(from).swapExactTokensForTokensSupportingFeeOnTransferTokens(
      amount,
      0,
      [tokenIn.address, tokenOut.address],
      from.address,
      await getBlockTimestamp() + 3600,
    );
  }

  describe('constructor', () => {
    it('should be created with 12h period', async () => {
      expect(await adjustedOracle.period()).to.eq(PERIOD);
    });

    it('should set initial price', async () => {
      // XXX price should be adjusted
      expect(await adjustedOracle.consult(token.address, toTokens(1))).to.eq(BigNumber.from(8425).mul(8425).div(4000));
    });

    it('should NOT be created when there is no liquidity', async () => {
      const tokenA = await (await ethers.getContractFactory('MockUSDC')).deploy();
      const tokenB = await (await ethers.getContractFactory('MockUSDC')).deploy();
      await factory.createPair(tokenA.address, tokenB.address);
      const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
      await expect((await ethers.getContractFactory('LedgityPriceOracleAdjusted')).deploy(pairAddress))
        .to.be.revertedWith('LedgityPriceOracle: NO_RESERVES');
    });
  });

  describe('update and consult', () => {
    async function testPriceDecreases(tokenA: Ledgity, tokenB: MockUSDC): Promise<void>;
    async function testPriceDecreases(tokenA: MockUSDC, tokenB: Ledgity): Promise<void>;
    async function testPriceDecreases(tokenA: Ledgity | MockUSDC, tokenB: Ledgity | MockUSDC) {
      const amountA = toTokens(1, await tokenA.decimals());
      const amountB = toTokens(1, await tokenB.decimals());
      const priceABefore = await adjustedOracle.consult(tokenA.address, amountA);
      const priceBBefore = await adjustedOracle.consult(tokenB.address, amountB);
      await swap(toTokens(1000, await tokenA.decimals()), tokenA, tokenB, aliceAccount);
      await evmIncreaseTime(PERIOD);
      await adjustedOracle.update();
      expect(await adjustedOracle.consult(tokenA.address, amountA)).to.be.lt(priceABefore);
      expect(await adjustedOracle.consult(tokenB.address, amountB)).to.be.gt(priceBBefore);
    }

    it('should decrease price relative to token0', async () => {
      // XXX
      await testPriceDecreases(token, usdc);
    });

    it('should decrease price relative to token1', async () => {
      // XXX
      await testPriceDecreases(usdc, token);
    });

    async function testPriceIncreases(tokenA: Ledgity, tokenB: MockUSDC): Promise<void>;
    async function testPriceIncreases(tokenA: MockUSDC, tokenB: Ledgity): Promise<void>;
    async function testPriceIncreases(tokenA: Ledgity | MockUSDC, tokenB: Ledgity | MockUSDC) {
      const amountA = toTokens(1, await tokenA.decimals());
      const amountB = toTokens(1, await tokenB.decimals());
      const priceABefore = await adjustedOracle.consult(tokenA.address, amountA);
      const priceBBefore = await adjustedOracle.consult(tokenB.address, amountB);
      await swap(toTokens(1000, await tokenB.decimals()), tokenB, tokenA, aliceAccount);
      await evmIncreaseTime(PERIOD);
      await adjustedOracle.update();
      expect(await adjustedOracle.consult(tokenA.address, amountA)).to.be.gt(priceABefore);
      expect(await adjustedOracle.consult(tokenB.address, amountB)).to.be.lt(priceBBefore);
    }

    it('should increase price relative to token0', async () => {
      // XXX
      await testPriceIncreases(token, usdc);
    });

    it('should increase price relative to token1', async () => {
      // XXX
      await testPriceIncreases(usdc, token);
    });

    it('should NOT update more than once per period', async () => {
      await evmIncreaseTime(PERIOD);
      await adjustedOracle.update();
      await evmIncreaseTime(PERIOD - 10);
      await expect(adjustedOracle.update()).to.be.revertedWith('LedgityPriceOracle: PERIOD_NOT_ELAPSED');
    });

    it('should update after period elapsed', async () => {
      await evmIncreaseTime(PERIOD);
      await adjustedOracle.update();
      await evmIncreaseTime(PERIOD);
      await adjustedOracle.update();  // OK
    });
  });

  describe('changePeriod', () => {
    it('should change period', async () => {
      await adjustedOracle.changePeriod(120);
      expect(await adjustedOracle.period()).to.eq(120);
    });

    it('should NOT allow not the owner to call it', async () => {
      await expect(adjustedOracle.connect(bobAccount).changePeriod(1)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should not allow 0 period', async () => {
      await expect(adjustedOracle.changePeriod(0)).to.be.revertedWith('LedgityPriceOracle: INVALID_PERIOD');
    });
  });

  // XXX
  describe('adjusted consult', () => {
    snapshottedBeforeEach(async () => {
      await token.setIsExcludedFromDexFee(alice, false);
    });

    async function testSellFee(gtX10IdoPrice: boolean, expectedFee: BigNumberish) {
      await evmIncreaseTime(PERIOD);
      await firstOracle.update();
      await adjustedOracle.update();
      expect((await firstOracle.consult(token.address, toTokens(1))).gte(parseUnits('0.04', usdcDecimals))).to.eq(gtX10IdoPrice);

      const reservesBefore = await pair.getReserves();
      const amount = toTokens(1000);
      await swap(amount, token, usdc, aliceAccount);
      const reserves = await pair.getReserves();
      const feeInTokens = amount.mul(expectedFee).div(100);
      expect(reserves[tokenIndex]).to.eq(reservesBefore[tokenIndex].add(amount).sub(feeInTokens));
    }

    it('should emulate < x10 IDO price to be equal to 0.04 USDC relative to the actual recorded initial price', async () => {
      // Raise price slightly less than x10 IDO price
      await swap(toTokens(274_300, usdcDecimals), usdc, token, aliceAccount);
      await testSellFee(false, 4 + 6 + 15);
    });

    it('should emulate > x10 IDO price to be equal to 0.04 USDC relative to the actual recorded initial price', async () => {
      // Raise price above x10 IDO price
      await swap(toTokens(274_400, usdcDecimals), usdc, token, aliceAccount);
      await testSellFee(true, 4 + 6);
    });
  });
});
