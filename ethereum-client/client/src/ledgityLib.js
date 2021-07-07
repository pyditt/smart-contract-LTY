import LedgityContractAbi from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
import { ethers } from "ethers";

const LedgityContractAddress = "0x75264cAdcC904651167B89e69D99CeFfcBc7283d";

async function start(ethereum) {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const accounts = await ethereum.request({
    method: "eth_accounts",
  });
  const LedgityContract = new ethers.Contract(
    LedgityContractAddress,
    LedgityContractAbi,
    signer
  );
  const LedgityContractWithS = LedgityContract.connect(signer);

  console.log(1, provider);
  console.log(2, LedgityContract);
  console.log(3, signer);
}

async function getInfo(contract) {
  const totalSupply = await contract.methods.totalSupply().call();
  const allSupply = await contract.methods.allSupply().call();
  const name = await contract.methods.name().call();
  const decimals = await contract.methods.decimals().call();
  const symbol = await contract.methods.symbol().call();
  const maxTokenTx = await contract.methods.maxTokenTx().call();
  const totalFee = await contract.methods.totalFee().call();
  const totalBurn = await contract.methods.totalBurn().call();
  const price = await contract.methods.getPrice().call();
  const startPrice = await contract.methods.getStartPrice().call();
  const owner = await contract.methods.owner().call();
  return {
    totalSupply,
    allSupply,
    name,
    decimals,
    symbol,
    maxTokenTx,
    totalFee,
    totalBurn,
    startPrice,
    price,
    owner,
  };
}

async function getTokenBalance(contract, address) {
  let balance = await contract.methods.balanceOf(address.toString()).call();
  balance.length > 9
    ? (balance = `${balance.substring(0, 9)}...`)
    : (balance = balance.substring(0, 9));
  return balance;
}

async function getBalance(web3, account) {
  let balance = await web3.eth.getBalance(account);
  balance = web3.utils.fromWei(balance, "ether");
  balance.length > 9
    ? (balance = `${balance.substring(0, 9)}...`)
    : (balance = balance.substring(0, 9));
  return balance;
}

async function getDex(contract) {
  const dex = await contract.methods.getDex().call();
  return dex;
}

async function getExcluded(contract) {
  const excluded = await contract.methods.getExcluded().call();
  return excluded;
}

async function transfer(contract, signer, address, amount) {
  const balance = await contract.methods
    .transfer(address.toString(), amount.toString())
    .send({ from: signer });
  return balance;
}

async function setPrice(contract, signer, newPrice) {
  const status = await contract.methods
    .setPrice(newPrice.toString())
    .send({ from: signer });
  return status;
}

async function burn(contract, signer, amount) {
  const status = await contract.methods
    .burn(amount.toString())
    .send({ from: signer });
  return status;
}

async function setDex(contract, signer, dexAddress) {
  await contract.methods.setDex(dexAddress.toString()).send({ from: signer });
}

async function includeAccount(contract, signer, address) {
  await contract.methods
    .includeAccount(address.toString())
    .send({ from: signer });
}

async function excludeAccount(contract, signer, address) {
  await contract.methods
    .excludeAccount(address.toString())
    .send({ from: signer });
}

async function addTokenToWallet(contract, ethereum, tokenAddress) {
  try {
    const info = await getInfo(contract);

    ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: info.symbol,
            decimals: info.decimals,
            image:
              "https://cdn.icon-icons.com/icons2/38/PNG/512/closeupmode_close_4630.png",
          },
        },
      })
      .then((success) => {
        if (success) {
          console.log(`${info.name} in your wallet!`);
          alert(`${info.name} in your wallet!`);
        } else {
          alert("Something went wrong.");
          throw new Error("Something went wrong.");
        }
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
  setPrice,
  burn,
  setDex,
  excludeAccount,
  includeAccount,
};
