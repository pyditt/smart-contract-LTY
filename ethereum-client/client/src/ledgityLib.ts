import { BigNumberish, Contract, ethers } from 'ethers';
import { Ledgity, LedgityPriceOracle } from './types/ethers-contracts';
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
  price: string
  owner: string
}

export async function getInfo(contract: Ledgity, usdc: Contract, priceOracle: LedgityPriceOracle|null): Promise<Info> {
  const decimals = (await contract.decimals()).toString()
  const usdcDecimals = await usdc.decimals();
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
    startPrice: ethers.utils.formatUnits(await contract.initialPrice(), usdcDecimals),
    price: priceOracle ? ethers.utils.formatUnits(await getPrice(contract, priceOracle), usdcDecimals) : 'N/A',
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
    ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: await contract.symbol(),
          decimals: await contract.decimals(),
          image: "https://i.ibb.co/D1gFDs8/Icon-circle-Colore-512.png",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function getPrice(ledgity: Ledgity, oracle: LedgityPriceOracle) {
  const oneToken = ethers.utils.parseUnits('1', await ledgity.decimals());
  return await oracle.consult(ledgity.address, oneToken);
}
