import Decimal from 'decimal.js';
import Web3 from 'web3';

async function getBalance(web3: Web3, account: string) {
  const balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance, "ether");
}

/**
 * Check MetaMask status
 * NOTE: If the user is logged out, then it will still true
 * @return {Boolean} Return true, if MetaMask installed and connected
 * @public
 */
function isMetaMask() {
  if ((window as any).ethereum) {
    return true;
  } else {
    return false;
  }
}

function delay(_DELAY = 5) {
  return new Promise((resolve, reject) => {
    // console.log(`Delay ${_DELAY}`)
    setTimeout(() => {
      resolve(`Time is up`);
    }, _DELAY * 1000);
  });
}

export function asPercent({ numerator, denominator }: { numerator: string, denominator: string; }): Decimal {
  return new Decimal(numerator).div(denominator);
}

export { getBalance, isMetaMask, delay };
