import React, { Component } from "react";
import { Contract, ethers } from "ethers";
import * as Lib from "./ledgityLib";
import { Ledgity, LedgityPriceOracle, LedgityPriceOracle__factory, Ledgity__factory } from "./types/ethers-contracts"

import { Header } from "./components/layout";
import { Dashboard, Connect } from "./pages";

import "./App.scss";
import { ZERO_ADDRESS } from './utils';

// TODO: extract to a config file
const LedgityContractAddress = "0xBee1dF5B64a84E47De64A803145262E898c68f1a";
const USDCContractAddress = "0xEc6802f549BC3E99FF12aF779A8e0B90453864C1";

// TODO: extract to a config file
const ws = new WebSocket("ws://52.12.224.224:9000");

interface State {
    balance: string,
    tokenBalance: string,
    web3: ethers.providers.Web3Provider | null,
    account: ethers.Signer | null,
    accountAddress: string | null,
    contract: Ledgity | null,
    usdcContract: Contract | null,
    priceOracleContract: LedgityPriceOracle | null,
    info: Lib.Info | null,
    ethereum: any | null,
    loading: boolean,
    ownership: boolean,
    users: number | null,
}

class App extends Component {
  state: State = {
    balance: "",
    tokenBalance: "",
    web3: null,
    account: null,
    accountAddress: null,
    contract: null,
    usdcContract: null,
    priceOracleContract: null,
    info: null,
    ethereum: null,
    loading: true,
    ownership: false,
    users: null,
  };

  componentDidMount = async () => {
    ws.onopen = () => {
      console.log("CONECT WS");
    };
    ws.onclose = () => {
      console.log("CLOSE WS");
    };
    ws.onmessage = (response) => {
      this.setState({ users: response.data });
    };
    if (window.ethereum) {
      this.setState({
        ethereum: window.ethereum,
      });
    }
  };

  connect = async () => {
    console.log(this.state.users);
    await window.ethereum.enable();
    const web3 = new ethers.providers.Web3Provider(window.ethereum);
    this.setState({
      web3: web3,
    });

    try {
      // Use web3 to get the user's account.
      const account = web3.getSigner()
      const accountAddress = await account.getAddress()

      // Get the contract instance.
      const contract = Ledgity__factory.connect(LedgityContractAddress, account);
      const oracleAddress = await contract.priceOracle();
      const priceOracleContract = oracleAddress !== ZERO_ADDRESS
        ? LedgityPriceOracle__factory.connect(oracleAddress, account)
        : null
      const usdcContract = new ethers.Contract(
        USDCContractAddress,
        [
          "function decimals() view returns (uint8)",
        ],
        account,
      );

      // Set web3, account, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account, accountAddress, contract, usdcContract, priceOracleContract }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load. First, connect the MetaMask.`);
      console.error(error);
    }
  };

  isOwner = (info: Lib.Info, account: string) => {
    return info.owner.toLowerCase() === account.toLowerCase()
  };

  runExample = async () => {
    const { account, contract, usdcContract, priceOracleContract, ethereum, web3 } = this.state;
    if (!account || !contract || !usdcContract || !ethereum || !web3) {
      window.location.reload();
      return;
    }

    ethereum.on("accountsChanged", async () => {
      const { contract, usdcContract, priceOracleContract, ethereum, web3 } = this.state;
      if (!contract || !usdcContract || !ethereum || !web3) {
        return;
      }
      const account = web3.getSigner();
      const accountAddress = await account.getAddress();
      const tokenBalance = await Lib.getTokenBalance(contract, accountAddress);
      const balance = await Lib.getBalance(web3, accountAddress);
      const info = await Lib.getInfo(contract, usdcContract, priceOracleContract);
      const ownership = this.isOwner(info, accountAddress);
      this.setState({
        account,
        accountAddress,
        balance,
        tokenBalance,
        info,
        ownership,
      });
    });

    ethereum.on("chainChanged", () => window.location.reload());
    ethereum.on("disconnect", () => window.location.reload());

    const accountAddress = await account.getAddress()
    const info = await Lib.getInfo(contract, usdcContract, priceOracleContract);
    const tokenBalance = await Lib.getTokenBalance(contract, accountAddress);
    const balance = await Lib.getBalance(web3, accountAddress);
    const ownership = this.isOwner(info, accountAddress);

    // Update state with the result.
    this.setState({
      totalSupply: info.totalSupply,
      name: info.name,
      decimals: info.decimals,
      symbol: info.symbol,
      tokenBalance,
      balance,
      totalBurn: info.totalBurn,
      totalFees: info.totalFees,
      startPrice: info.startPrice,
      price: info.price,
      info: info,
      loading: false,
      ownership,
    });
  };

  updateInfo = async () => {
    // console.log('update info');
    const { contract, usdcContract, priceOracleContract } = this.state;
    if (!contract || !usdcContract) {
      return;
    }
    this.setState({ loading: true });
    const info = await Lib.getInfo(contract, usdcContract, priceOracleContract);
    this.setState({ info: info, loading: false });
  };

  updateBalances = async () => {
    // console.log('update balance');
    const { contract, accountAddress, web3 } = this.state;
    if (!contract || !accountAddress || !web3) {
      return;
    }
    const tokenBalance = await Lib.getTokenBalance(contract, accountAddress);
    const balance = await Lib.getBalance(web3, accountAddress);
    this.setState({ balance: balance, tokenBalance: tokenBalance });
  };

  render() {
    const {
      tokenBalance,
      balance,
      contract,
      account,
      accountAddress,
      ethereum,
      info,
      loading,
      ownership,
      users,
    } = this.state;

    if (!ethereum) {
      return (
        <Connect>
          <div className="connect__install">
            <p>
              Loading Web3, accounts, and contract. <br />
              If you do not have MetaMask please install...
            </p>
            <a href="https://metamask.io/download" className="btn-primary">
              Install Metamask
            </a>{" "}
          </div>
        </Connect>
      );
    }
    return (
      <div className="app-layout">
        {ethereum && account && contract && info ? (
          <>
            <Header
              address={accountAddress}
              addToken={() =>
                Lib.addTokenToWallet(contract, ethereum, LedgityContractAddress)
              }
              balance={balance}
              tokenBalance={tokenBalance}
              info={info}
              users={users}
              updateBalances={() => this.updateBalances()}
            />
            <main>
              <Dashboard
                loading={loading}
                account={accountAddress}
                info={info}
                ownership={ownership}
                contract={contract}
                tokenBalance={tokenBalance}
                getAddress={() => contract.getExcluded()}
                getDex={() => contract.getDexes()}
                updateInfo={() => this.updateInfo()}
                updateBalances={() => this.updateBalances()}
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