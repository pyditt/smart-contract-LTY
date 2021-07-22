import BN from 'bn.js';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiBN from 'chai-bn';
import { LedgityInstance, MockLedgityInstance, MockUSDCInstance, ReserveInstance, UniswapV2FactoryInstance, UniswapV2PairInstance, UniswapV2Router02Instance } from '../types/truffle-contracts';
import { addLiquidityUtil, toTokens, ZERO_ADDRESS } from './utils';
const MockLedgity = artifacts.require('MockLedgity');
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


contract.only('Reserve', (addresses) => {
  const [alice, bob] = addresses;

  /**
   * Simulate token. Should call `swapAndLiquify` and `swapAndCollect` functions.
   */
  let token: MockLedgityInstance;
  let reserve: ReserveInstance;
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
    token = await MockLedgity.new({ from: alice });
    await token.mint(alice, toTokens('100000000000000'));
    reserve = await Reserve.new(router.address, token.address, usdcToken.address);
    await token.setReserve(reserve.address);
  });

  async function addLiquidity(tokenAmount: string, usdcAmount: string) {
    await addLiquidityUtil(tokenAmount, usdcAmount, token as unknown as LedgityInstance, usdcToken, router, alice);
  }

  async function getPair() {
    const pairAddress = await factory.getPair(token.address, usdcToken.address);
    return await UniswapV2Pair.at(pairAddress);
  }

  async function getPairIndices(pair: UniswapV2PairInstance) {
    return await pair.token0() === token.address ? [0, 1] as const : [1, 0] as const;
  }

  describe('swapping for USDC', () => {
    beforeEach(async () => {
      await addLiquidity('10', '1');
    });

    it('should swap tokens for USDC and store USDC in the reserve', async () => {
      const amount = toTokens('10');
      const usdcBalanceBefore = await usdcToken.balanceOf(reserve.address);
      await token.transfer(reserve.address, amount, { from: alice });
      await token.swapAndCollect(amount);
      expect(await token.balanceOf(reserve.address)).to.bignumber.eq('0', 'reserve token balance');
      expect(await usdcToken.balanceOf(reserve.address)).to.bignumber.gt(usdcBalanceBefore, 'reserve usdc balance');
    });

    it('should not allow anyone except the token contract to swap the tokens', async () => {
      for (const sender of [alice, bob]) {
        await expect(reserve.swapAndCollect('10', { from: sender })).to.eventually.be.rejectedWith(Error, 'Reserve: caller is not the token');
      }
    });
  });

  describe('swap and liquify', () => {
    beforeEach(async () => {
      await addLiquidity('10000', '1000');
    });

    async function testSwapAndLiquify(reserveBalance: BN, amount: BN) {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();
      await token.transfer(reserve.address, reserveBalance.add(amount), { from: alice });
      await token.swapAndLiquify(amount);

      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.bignumber.eq(reservesBefore[tokenIndex].add(reserveBalance.add(amount)), 'token');
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex], 'usdc');  // USDC reserves unchanged
    }

    it('should swap and liquify all tokens, if the reserve has enough tokens on the balance', async () => {
      await testSwapAndLiquify(toTokens('30'), toTokens('10'));
    });

    it('should swap and liquify only a portion of tokens, if the reserve does NOT have enough tokens on the balance', async () => {
      await testSwapAndLiquify(toTokens('5'), toTokens('10'));
    });

    it('should not allow anyone except the token contract to swap and liquify tokens', async () => {
      for (const sender of [alice, bob]) {
        await expect(reserve.swapAndLiquify('10', { from: sender })).to.eventually.be.rejectedWith(Error, 'Reserve: caller is not the token');
      }
    });
  });

  describe('buy and burn', () => {
    beforeEach(async () => {
      await addLiquidity('10000', '1000');
    });

    it('should buy tokens and burn them', async () => {
      const pair = await getPair();
      const reservesBefore = await pair.getReserves();
      const totalSupplyBefore = await token.totalSupply();

      const usdcAmount = toTokens('10', await usdcToken.decimals());
      await usdcToken.mint(reserve.address, usdcAmount);
      await reserve.buyAndBurn(usdcAmount, { from: alice });

      expect(await token.totalSupply()).to.bignumber.lt(totalSupplyBefore, 'supply');
      const reserves = await pair.getReserves();
      const [tokenIndex, usdcIndex] = await getPairIndices(pair);
      expect(reserves[tokenIndex]).to.bignumber.lt(reservesBefore[tokenIndex], 'token');
      expect(reserves[usdcIndex]).to.bignumber.eq(reservesBefore[usdcIndex].add(usdcAmount), 'usdc');
    });

    it('should not allow anyone except the owner of the contract to buy and burn tokens', async () => {
      await expect(reserve.buyAndBurn('10', { from: bob })).to.eventually.be.rejectedWith(Error, 'Ownable: caller is not the owner');
    });
  });
});
