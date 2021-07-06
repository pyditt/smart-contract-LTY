import LedgityContract from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
import ethers from "ethers";

async function getInfo(contract) {
  const totalSupply = await contract.methods.totalSupply().call();
  // const allSupply = await contract.methods.allSupply().call();
  const name = await contract.methods.name().call();
  const decimals = await contract.methods.decimals().call();
  const symbol = await contract.methods.symbol().call();
  // const maxTokenTx = await contract.methods.maxTokenTx().call();
  // const totalFee = await contract.method.totalFee().call();
  // const totalBurn = await contract.method.totalBurn().call();
  // const getPrice = await contract.method.getPrice().call();
  // const getStartPrice = await contract.method.getStartPrice().call();
  return {
    totalSupply,
    // allSupply,
    name,
    decimals,
    symbol,
    // maxTokenTx,
    // totalFee,
    // totalBurn,
    // getStartPrice,
    // getPrice
  };
}

async function getTokenBalance(contract, address) {
  const balance = await contract.methods.balanceOf(address.toString()).call();
  return balance;
}

function getBalance(address, ethereum) {
  return new Promise(async (resolve, reject) => {
    try {
      const balance = await ethereum.provider.getBalance(address);
      resolve(Number(ethers.utils.formatEther(balance.toString())));
    } catch (error) {
      reject(error);
    }
  });
}

async function getDex(contract, address) {
  const dex = await contract.methods.getDex().call();
  return dex;
}

async function getExcluded(contract, address) {
  const excluded = await contract.methods.getExcluded().call();
  return excluded;
}

async function transfer(contract, signer, address, amount) {
  const balance = await contract.methods
    .transfer(address.toString(), amount.toString())
    .send({ from: signer });
  return balance;
}

async function addTokenToWallet(contract, ethereum) {
  try {
    const info = await getInfo(contract);

    ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0x2728D841b04E50834d1AE21D52056454CeE58114",
            symbol: info.symbol,
            decimals: info.decimals,
            //image: 'https://cdn.icon-icons.com/icons2/38/PNG/512/closeupmode_close_4630.png',
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
};
