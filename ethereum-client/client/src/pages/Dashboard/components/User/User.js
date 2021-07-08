import React, {useState} from "react";
import * as Lib from "../../../../ledgityLib";
import ExcludeAddress from "./components/ExcludeAddress";
import DexAccounts from "./components/DexAccounts";

import "./User.scss";

const User = (props) => {
  const [accountInput, setAccountInput] = useState('');
  const [balance, setBalance] = useState(null);
  const [errorEl, setErrorEl] = useState(null);
  const [token, setToken] = useState('');
  const [address, setAddress] = useState('');

  const getTokenBalance = async () => {
    setErrorEl(null);
    try {
      const tokenAccountBalance = await Lib.getTokenBalance(props.contract, accountInput);
      setBalance(tokenAccountBalance);
    } catch(error) {
      setErrorEl(<p> Incorrect address. Please, check it.. </p>);
    }
  };

  const onChange = (event) => {
    // console.log('name=', event.target.name);
    switch (event.target.name) {
      case 'account': return setAccountInput(event.target.value);
      case 'token': return setToken(event.target.value);
      case 'address': return setAddress(event.target.value);
    }
  };

  const transferTokens = async (event) => {
    event.preventDefault();
    console.log(event);

    console.log('token', token);
    console.log('address', address);
    /*
        Lib.transfer(
          contract,
          accounts[0], // signer
          "0xB984f9F42d405A37F7f3903C73cbF7112DCc859b", //recipient
          10000000000 //amount
        );
        */

    await Lib.transfer(
        props.contract,
        props.account,
        address,
        token
    );
    console.log('transfer');
    props.updateInfo();

    setToken('');
    setAddress('');

  };

  return (
    <div className="user">
      <h2 className="title"> User </h2>
      <div className="user__block">
        <div className="user__item">
          <h2> Get the balance of the Address: </h2>
          <div className="user__fields">
            <div className="user__field field">
              <input
                type="text"
                placeholder="Enter account address"
                name="account"
                className="field__input"
                value={accountInput}
                onChange={onChange}
              />
              <button
                  type="button"
                  className="btn-primary"
                  onClick={getTokenBalance}
              >
                Get balance
              </button>
              <div className="error-field"> {errorEl} </div>
            </div>
            <div className="user__balance">
              <span> Account balance: </span>
              <h2> {balance || '0'} LTY</h2>
            </div>
          </div>
        </div>

        <div className="user__item columns">
          <ExcludeAddress getAddress={props.getAddress}/>
          <DexAccounts getDex={props.getDex}/>
        </div>

        <div className="user__item">
          <h2> Transfer tokens: </h2>
          <div className="user__field field">
            <form className="user__form" onSubmit={transferTokens}>
              <input
                type="text"
                placeholder="Number of tokens"
                name="token"
                className="field__input"
                value={token}
                onChange={onChange}
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                className="field__input"
                value={address}
                onChange={onChange}
              />
              <button
                  type="submit"
                  className="btn-primary"
              >
                Transfer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
