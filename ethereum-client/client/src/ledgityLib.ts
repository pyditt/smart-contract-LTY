import BN from 'bn.js';
import Decimal from 'decimal.js';
import Web3 from 'web3';
import { Ledgity } from '../types/web3-v1-contracts/Ledgity';
import { asPercent } from './utils';

export interface Info {
  totalSupply: BN
  name: string
  symbol: string
  decimals: BN
  maxTokenTxPercent: Decimal
  totalFees: string
  startPrice: string
  owner: string
}
async function getInfo(contract: Ledgity): Promise<Info> {
  const decimals = new BN(await contract.methods.decimals().call());
  function removeDecimals(value: string) {
    return new BN(value).div(new BN(10).pow(decimals));
  }
  return {
    totalSupply: removeDecimals(await contract.methods.totalSupply().call()),
    name: await contract.methods.name().call(),
    symbol: await contract.methods.symbol().call(),
    decimals,
    maxTokenTxPercent: asPercent(await contract.methods.maxTransactionSizePercent().call()),
    totalFees: await contract.methods.totalFees().call(),
    startPrice: await contract.methods.initialPrice().call(),
    owner: await contract.methods.owner().call(),
  };
}

async function getTokenBalance(contract: Ledgity, address: string) {
  const balance = new BN(await contract.methods.balanceOf(address).call());
  const decimals = new BN(await contract.methods.decimals().call());
  return balance.div(new BN(10).pow(decimals)).toString();
}

async function getBalance(web3: Web3, account: string) {
  const balance = await web3.eth.getBalance(account);
  return web3.utils.fromWei(balance, "ether");
}

async function getDex(contract: Ledgity) {
  // TODO
  return [];
  // const dex = await contract.methods.getDex().call();
  // return dex;
}

async function getExcluded(contract: Ledgity) {
  // TODO
  return [];
  // const excluded = await contract.methods.getExcluded().call();
  // return excluded;
}

async function transfer(contract: Ledgity, signer: string, address: string, amount: BN) {
  const decimals = new BN(await contract.methods.decimals().call());
  amount = amount.mul(new BN(10).pow(decimals));
  const balance = await contract.methods
    .transfer(address, amount)
    .send({ from: signer });
  return balance;
}

async function burn(contract: Ledgity, signer: string, amount: BN) {
  const decimals = new BN(await contract.methods.decimals().call());
  amount = amount.mul(new BN(10).pow(decimals));
  const status = await contract.methods
    .burn(amount)
    .send({ from: signer });
  return status;
}

async function setDex(contract: Ledgity, signer: string, dexAddress: string) {
  await contract.methods.setDex(dexAddress, true).send({ from: signer });
}

async function includeAccount(contract: Ledgity, signer: string, address: string) {
  await contract.methods
    .includeAccount(address)
    .send({ from: signer });
}

async function excludeAccount(contract: Ledgity, signer: string, address: string) {
  await contract.methods
    .excludeAccount(address)
    .send({ from: signer });
}

async function addTokenToWallet(contract: Ledgity, ethereum: any, tokenAddress: string) {
  try {
    const info = await getInfo(contract);

    ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: info.symbol,
          decimals: info.decimals,
          image: "https://i.ibb.co/D1gFDs8/Icon-circle-Colore-512.png",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export {
  getInfo,
  getTokenBalance,
  getBalance,
  addTokenToWallet,
  transfer,
  getDex,
  getExcluded,
  burn,
  setDex,
  excludeAccount,
  includeAccount,
};
