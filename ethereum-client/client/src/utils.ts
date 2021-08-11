import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Check MetaMask status
 * NOTE: If the user is logged out, then it will still true
 * @return {Boolean} Return true, if MetaMask installed and connected
 * @public
 */
export function isMetaMask() {
  return window.ethereum != null;
}

export function delay(_DELAY: number) {
  return new Promise((resolve, reject) => {
    // console.log(`Delay ${_DELAY}`)
    setTimeout(() => {
      resolve(`Time is up`);
    }, _DELAY * 1000);
  });
}

export function asPercent({ numerator, denominator }: { numerator: BigNumber, denominator: BigNumber; }): Decimal {
  return new Decimal(numerator.toString()).div(denominator.toString());
}
