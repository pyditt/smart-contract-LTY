import BN from 'bn.js';
import { HttpProvider } from 'web3-core';
import { LedgityInstance, MockUSDCInstance, UniswapV2Router02Instance } from '../types/truffle-contracts';

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
export const LEDGITY_DECIMALS = new BN('9');
export function toTokens(amount: string, decimals: string | BN = LEDGITY_DECIMALS) {
  return new BN(amount).mul(new BN('10').pow(new BN(decimals)));
}

export async function addLiquidityUtil(tokenAmountWithoutDecimals: string, usdcAmountWithoutDecimals: string, token: LedgityInstance, usdcToken: MockUSDCInstance, router: UniswapV2Router02Instance, from: string) {
  const tokenAmount = toTokens(tokenAmountWithoutDecimals);
  const usdcAmount = toTokens(usdcAmountWithoutDecimals, await usdcToken.decimals());
  await token.approve(router.address, tokenAmount, { from });
  await usdcToken.mint(from, usdcAmount);
  await usdcToken.approve(router.address, usdcAmount, { from });
  await router.addLiquidity(token.address, usdcToken.address, tokenAmount, usdcAmount, 0, 0, ZERO_ADDRESS, Math.floor(Date.now() / 1000) + 3600, { from });
}
