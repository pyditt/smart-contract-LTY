import React, { Component } from "react";
import LedgityContract from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
import * as Lib from "./ledgityLib";
import * as Utils from "./utils";
import { ethers } from "ethers";

import "./App.css";

const LedgityContractAddress = "0x75264cAdcC904651167B89e69D99CeFfcBc7283d";

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
    const web3 = this.state.web3;
    console.log(web3.eth);
    const { accounts, contract } = this.state;
    const ethereum = window.ethereum;
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
    const balance = await Utils.getBalance(web3, accounts[0]);

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
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <br />
        <br />
        {/* <button
          className="enableEthereumButton"
          onClick={() =>
            window.ethereum.request({ method: "eth_requestAccounts" })
          }
        >
          Enable Ethereum
        </button> */}
        <br />
        <br />
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>

        <div>The stored totalSupply value is: {this.state.totalSupply}</div>
        <div>The stored name value is: {this.state.name}</div>
        <div>The stored symbol value is: {this.state.symbol}</div>
        <div>The stored decimals value is: {this.state.decimals}</div>
        <br />
        <div> Account: {this.state.accounts[0]} </div>
        <div> Balance(token) is: {this.state.tokenBalance} LTY</div>
        <div> Balance(ETH) is: {this.state.balance} ETH</div>
      </div>
    );
  }
}

export default App;
