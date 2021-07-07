import React, { Component } from "react";
import LedgityContract from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
import * as Lib from "./ledgityLib";
import * as Utils from "./utils";
import { ethers } from "ethers";

import { Header, Modal } from "./components/layout";
import { Dashboard, Connect } from "./pages";

import "./App.scss";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    const ethereum = window.ethereum;
    const web3 = await getWeb3();
    ethereum.on("accountsChanged", async () => {
      const { contract, web3 } = this.state;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const tokenBalance = await Lib.getTokenBalance(contract, accounts[0]);
      const balance = await Utils.getBalance(web3, accounts[0]);
      this.setState({ accounts: accounts, balance, tokenBalance });
    });

    ethereum.on("chainChanged", (_chainId) => window.location.reload());
    ethereum.on("disconnect", () => console.log("MetaMask Disconnect"));

    try {
      // Get network provider and web3 instance.

      // Use web3 to get the user's accounts.
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = networkId;
      const instance = new web3.eth.Contract(
        LedgityContract,
        "0x2728D841b04E50834d1AE21D52056454CeE58114"
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
    const web3 = this.state.web3;
    console.log(web3.eth);
    const { accounts, contract } = this.state;
    const ethereum = window.ethereum;
    // Stores a given value, 5 by default.
    // await contract.methods.transfer("0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", 10000000000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const info = await Lib.getInfo(contract);
    const tokenBalance = await Lib.getTokenBalance(contract, accounts[0]);
    const balance = await Utils.getBalance(web3, accounts[0]);

    /*
    Lib.transfer(
      contract,
      accounts[0], // signer
      "0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", //recipient
      10000000000 //amount
    );
    */

    // Add token to wallet
    // Lib.addTokenToWallet(contract, ethereum);

    // Add LTY token to your wallet
    // Lib.addTokenToWallet(contract, ethereum);

    // Update state with the result.
    this.setState({
      totalSupply: info.totalSupply,
      name: info.name,
      decimals: info.decimals,
      symbol: info.symbol,
      tokenBalance,
      balance,
    });
  };

  render() {
    const { web3, accounts } = this.state;

    if(accounts) {
      console.log('app');
    } else {
      console.log('empty');
    }

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="app-layout">
        {accounts
            ? (
                <>
                  <Header />
                  <main>
                    <Dashboard />
                  </main>
                </>
              )
            : <Connect />
        }
      </div>
    );
  }
};

export default App;
