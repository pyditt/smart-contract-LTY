import React, { Component } from "react";
import LedgityContract from "./contracts/Ledgity.json";
import getWeb3 from "./getWeb3";
// import Lib from "./ledgityLib";
import { ethers } from "ethers";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    // console.log("Ethereum ----------------",Ethereum);
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = networkId;
      console.log(deployedNetwork);
      const instance = new web3.eth.Contract(
        LedgityContract,
        "0x2728D841b04E50834d1AE21D52056454CeE58114",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log(accounts);
    // Stores a given value, 5 by default.
    // await contract.methods.transfer("0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", 10000000000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const totalSupply = await contract.methods.totalSupply().call();
    const name = await contract.methods.name().call();
    const decimals = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();

    // Update state with the result.
    this.setState({ totalSupply: totalSupply, name, decimals, symbol });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        
        <div>The stored totalSupply value is: {this.state.totalSupply}</div>
        <div>The stored name value is: {this.state.name}</div>
        <div>The stored symbol value is: {this.state.symbol}</div>
        <div>The stored decimals value is: {this.state.decimals}</div>
      </div>
    );
  }
}

export default App;
