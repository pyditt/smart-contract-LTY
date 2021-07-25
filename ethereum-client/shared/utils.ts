import { BigNumber, BigNumberish, Signer } from 'ethers';
import { ethers, web3 } from 'hardhat';
import { HttpProvider } from 'web3-core';
import { ILedgity, MockUSDC, UniswapV2Factory__factory, UniswapV2Router02, UniswapV2Router02__factory, WETH9__factory } from '../typechain';
import UniswapV2FactoryArtifact from '../uniswap_build/contracts/UniswapV2Factory.json';
import UniswapV2Router02Artifact from '../uniswap_build/contracts/UniswapV2Router02.json';
import WETH9Artifact from '../uniswap_build/contracts/WETH9.json';

export async function blockchainTimeTravel(cb: (travel: (offset: number) => Promise<void>) => Promise<void>) {
  function advanceBlockAtTime(time: number) {
    return new Promise<void>((resolve, reject) => {
      (web3.currentProvider as HttpProvider).send(
        {
          jsonrpc: "2.0",
          method: "evm_mine",
          params: [time],
          id: new Date().getTime(),
        },
        (err, _) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  }

  let time = Math.floor(Date.now() / 1000);
  await cb(async offset => {
    time += offset;
    await advanceBlockAtTime(time);
  });
  // Reset time
  await advanceBlockAtTime(Math.floor(Date.now() / 1000));
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const LEDGITY_DECIMALS = BigNumber.from('9');
export function toTokens(amount: BigNumberish, decimals: BigNumberish = LEDGITY_DECIMALS) {
  return BigNumber.from(amount).mul(BigNumber.from('10').pow(decimals));
}

export async function addLiquidityUtil(tokenAmountWithoutDecimals: BigNumberish, usdcAmountWithoutDecimals: BigNumberish, token: ILedgity, usdcToken: MockUSDC, router: UniswapV2Router02, from: string) {
  const tokenAmount = toTokens(tokenAmountWithoutDecimals);
  const usdcAmount = toTokens(usdcAmountWithoutDecimals, await usdcToken.decimals());
  await token.approve(router.address, tokenAmount, { from });
  await usdcToken.mint(from, usdcAmount);
  await usdcToken.approve(router.address, usdcAmount, { from });
  await router.addLiquidity(token.address, usdcToken.address, tokenAmount, usdcAmount, 0, 0, ZERO_ADDRESS, Math.floor(Date.now() / 1000) + 3600, { from });
}

export async function deployUniswap(signer: Signer) {
  const UniswapV2Factory = new ethers.ContractFactory(UniswapV2FactoryArtifact.abi, UniswapV2FactoryArtifact.bytecode, signer) as UniswapV2Factory__factory;
  const UniswapV2Router02 = new ethers.ContractFactory(UniswapV2Router02Artifact.abi, UniswapV2Router02Artifact.bytecode, signer) as UniswapV2Router02__factory;
  const WETH9 = new ethers.ContractFactory(WETH9Artifact.abi, WETH9Artifact.bytecode, signer) as WETH9__factory;
  const factory = await UniswapV2Factory.deploy(ZERO_ADDRESS);
  const weth = await WETH9.deploy();
  const router = await UniswapV2Router02.deploy(factory.address, weth.address);
  return { factory, router, weth };
}
