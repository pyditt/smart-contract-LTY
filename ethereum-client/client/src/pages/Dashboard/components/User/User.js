import React, {useState} from "react";
import * as Lib from "../../../../ledgityLib";
import ExcludeAddress from "./components/ExcludeAddress";
import DexAccounts from "./components/DexAccounts";

import "./User.scss";

const User = (props) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(null);
  const [errorEl, setErrorEl] = useState(null);

  const getTokenBalance = async () => {
    setErrorEl(null);
    try {
      const tokenAccountBalance = await Lib.getTokenBalance(props.contract, account);
      setBalance(tokenAccountBalance);
    } catch(error) {
      setErrorEl(<p> Incorrect address. Please, check it.. </p>);
    }
  };

  const onChange = (event) => {
    // console.log('event=', event.target.value);
    setAccount(event.target.value);
  }

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
                value={account}
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
            <form action="" className="user__form">
              <input
                type="text"
                placeholder="Number of tokens"
                name="token"
                className="field__input"
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                className="field__input"
              />
              <button type="submit" className="btn-primary">
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
