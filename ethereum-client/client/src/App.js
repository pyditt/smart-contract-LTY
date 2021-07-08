import React, { Component } from "react";
import LedgityContract from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
import * as Lib from "./ledgityLib";
import * as Utils from "./utils";
import { ethers } from "ethers";

import { Header, Modal } from "./components/layout";
import { Dashboard, Connect } from "./pages";

import "./App.scss";

const LedgityContractAddress = "0x75264cAdcC904651167B89e69D99CeFfcBc7283d";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    ethereum: null,
    loading: true,
  };

  componentDidMount = async () => {
    if (window.ethereum) {
      const web3 = await getWeb3(); // FIX!!!!
      this.setState({
        ethereum: window.ethereum,
        web3: web3,
      });
    }
  };

  connect = async () => {
    const { ethereum, contract, web3 } = this.state;

    try {
      // Get network provider and web3 instance.

      // Use web3 to get the user's accounts.
      const accounts = await this.state.ethereum.request({
        method: "eth_accounts",
      });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = networkId;
      const instance = new web3.eth.Contract(
        LedgityContract,
        LedgityContractAddress
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, ethereum, web3 } = this.state;

    ethereum.on("accountsChanged", async () => {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(contract);
      const tokenBalance = await Lib.getTokenBalance(contract, accounts[0]);
      const balance = await Lib.getBalance(web3, accounts[0]);
      const info = await Lib.getInfo(contract);
      this.setState({ accounts: accounts, balance, tokenBalance, info });
    });

    ethereum.on("chainChanged", (_chainId) => window.location.reload());
    ethereum.on("disconnect", () => window.location.reload());

    // Stores a given value, 5 by default.
    // await contract.methods.transfer("0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", 10000000000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.

    const info = await Lib.getInfo(contract);
    console.log(
      "-------------------------",
      info,
      "------------------------------------"
    );
    const tokenBalance = await Lib.getTokenBalance(contract, accounts[0]);
    const balance = await Lib.getBalance(web3, accounts[0]);

    console.log("excl: ", Lib.getExcluded(contract));
    console.log("DEX: ", Lib.getDex(contract));

    /*
        Lib.transfer(
          contract,
          accounts[0], // signer
          "0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", //recipient
          10000000000 //amount
        );
        */

    /*
        Lib.setPrice(
          contract,
          accounts[0], // signer
          7 //newPrice
        );
        */

    /*
        Lib.burn(
          contract,
          accounts[0], // signer
          1000000 //newPrice
        );
        */

    /*
        Lib.setDex(
          contract,
          accounts[0], // signer
          "0xB984f9F42d405A37F7f3903C73cbF7112DCc859b" //dexAddress
        );
        */

    /*
        Lib.includeAccount(
          contract,
          accounts[0],
          "0xB984f9F42d405A37F7f3903C73cbF7112DCc859b"
        );
        */

    /*
        Lib.excludeAccount(
          contract,
          accounts[0],
          "0x4803003e06Fe7Bc150cC8CB21D12750A1A1bA135"
        );
        */

    // Add token to wallet
    // Lib.addTokenToWallet(contract, ethereum);

    // Add LTY token to your wallet
    // Lib.addTokenToWallet(contract, ethereum, LedgityContractAddress);

    // Update state with the result.
    this.setState({
      totalSupply: info.totalSupply,
      name: info.name,
      decimals: info.decimals,
      symbol: info.symbol,
      tokenBalance,
      balance,
      totalBurn: info.totalBurn,
      totalFee: info.totalFee,
      startPrice: info.startPrice,
      price: info.price,
      info: info,
      loading: false,
    });
  };

  setPrice = async () => {
    const { contract, accounts } = this.state;
    await Lib.setPrice(
      contract,
      accounts[0], // signer
      11 //newPrice
    );
    console.log("set");
    const info = await Lib.getInfo(contract);
    console.log(info);
    this.setState({ info: info });
  };

  updateInfo = async () => {
    const { contract } = this.state;
    this.setState({ loading: true });
    const info = await Lib.getInfo(contract);
    this.setState({ info: info, loading: false });
  };

  render() {
    const { tokenBalance, balance, contract, accounts, ethereum, info, loading } =
      this.state;

    if (!ethereum) {
      return (
        <div>
          Loading Web3, accounts, and contract. If you do not have{" "}
          <a href="https://metamask.io/download">MetaMask please install...</a>{" "}
        </div>
      );
    }
    return (
      <div className="app-layout">
        {ethereum && accounts ? (
          <>
            {/*<button onClick={() => this.setPrice()}>setPrice</button>*/}
            <Header
              address={accounts[0]}
              addToken={() =>
                Lib.addTokenToWallet(contract, ethereum, LedgityContractAddress)
              }
              balance={balance}
              tokenBalance={tokenBalance}
              info={info}
            />
            <main>
              <Dashboard
                loading={loading}
                account={accounts[0]}
                info={info}
                contract={contract}
                getAddress={() => Lib.getExcluded(contract)}
                getDex={() => Lib.getDex(contract)}
                updateInfo={() => this.updateInfo()}
              />
            </main>
          </>
        ) : (
          <Connect connect={this.connect} />
        )}
      </div>
    );
  }
}

export default App;
