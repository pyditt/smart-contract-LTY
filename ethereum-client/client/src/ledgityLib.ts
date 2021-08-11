import { BigNumberish, ethers } from 'ethers';
import { Ledgity } from './types/ethers-contracts';
import { asPercent } from './utils';

export interface Info {
  initialTotalSupply: string
  totalSupply: string
  name: string
  symbol: string
  decimals: string
  maxTokenTx: string
  totalFees: string
  totalBurn: string
  startPrice: string
  owner: string
}

export async function getInfo(contract: Ledgity): Promise<Info> {
  const decimals = (await contract.decimals()).toString()
  function removeDecimals(value: BigNumberish) {
    return ethers.utils.formatUnits(value, decimals)
  }
  const totalSupplyWoDecimals = removeDecimals(await contract.totalSupply());
  return {
    initialTotalSupply: removeDecimals(await contract.initialTotalSupply()),
    totalSupply: totalSupplyWoDecimals,
    name: await contract.name(),
    symbol: await contract.symbol(),
    decimals,
    maxTokenTx: asPercent(await contract.maxTransactionSizePercent()).mul(totalSupplyWoDecimals).toString(),
    totalFees: removeDecimals(await contract.totalFees()),
    totalBurn: removeDecimals(await contract.totalBurn()),
    startPrice: (await contract.initialPrice()).toString(),
    owner: await contract.owner(),
  };
}

export async function getTokenBalance(contract: Ledgity, address: string) {
  return ethers.utils.formatUnits(await contract.balanceOf(address), await contract.decimals())
}

export async function getBalance(web3: ethers.providers.Web3Provider, account: string) {
  return ethers.utils.formatEther(await web3.getBalance(account));
}

export async function transfer(contract: Ledgity, address: string, amount: BigNumberish) {
  amount = ethers.utils.parseUnits(amount.toString(), await contract.decimals())
  await contract.transfer(address, amount)
}

export async function burn(contract: Ledgity, amount: BigNumberish) {
  amount = ethers.utils.parseUnits(amount.toString(), await contract.decimals())
  await contract.burn(amount)
}

export async function addTokenToWallet(contract: Ledgity, ethereum: any, tokenAddress: string) {
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
