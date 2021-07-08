import React, { useState } from "react";

import "./Owner.scss";
import * as Lib from "../../../../ledgityLib";

const Owner = ({ contract, account, updateInfo }) => {
  const [price, setPrice] = useState('');
  const [token, setToken] = useState('');
  const [dex, setDex] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [errorEl, setErrorEl] = useState(null);

  const onChange = (event) => {
    switch (event.target.name) {
      case "price":
        return setPrice(event.target.value);
      case "token":
        return setToken(event.target.value);
      case "dex":
        return setDex(event.target.value);
      case "account":
        return setAccountInput(event.target.value);
    }
  };

  const applyPrice = async (event) => {
    event.preventDefault();
    await Lib.setPrice(
        contract,
        account,
        price
    );
    setPrice('');
    updateInfo();
  };

  const burnToken = async (event) => {
    event.preventDefault();
    await Lib.burn(
        contract,
        account,
        token
    );
    setToken('');
    updateInfo();
  }

  const addDex = async (event) => {
    event.preventDefault();
    setErrorEl(null);
    const allDex = await Lib.getDex(contract);
    if (allDex.indexOf(dex) === -1) {
      await Lib.setDex(
          contract,
          account,
          dex
      );
      setDex('');
    } else {
      setErrorEl(<p> Incorrect address. Please, check it.. </p>);
    }

  }

  const excludeAccount = async () => {
    await Lib.excludeAccount(
        contract,
        account,
        accountInput
    );
    setAccountInput('');
  }

  const includeAccount = async () => {
    await Lib.includeAccount(
        contract,
        account,
        accountInput
    );
    setAccountInput('');
  }

  return (
    <div className="owner">
      <h2 className="title"> Owner </h2>
      <div className="owner__block">
        <div className="owner__item commission">
          <h2> Get the balance of the Address: </h2>
          <div className="owner__fields">
            <form className="owner__field field" onSubmit={applyPrice}>
              <label className="field__label" htmlFor="price">
                Set a price:
              </label>
              <input
                type="number"
                name="price"
                className="field__input"
                placeholder="Enter price"
                value={price}
                onChange={onChange}
              />
              <button type="submit" className="btn-primary"> Set </button>
            </form>
            <form className="owner__field field" onSubmit={burnToken}>
              <label className="field__label" htmlFor="token">
                Burn token:
              </label>
              <input
                  type="number"
                  name="token"
                  className="field__input"
                  value={token}
                  onChange={onChange}
              />
              <button type="submit" className="btn-primary"> Burn </button>
            </form>
            <form className="owner__field field" onSubmit={addDex}>
              <input
                type="text"
                placeholder="Enter address"
                name="dex"
                className="field__input"
                value={dex}
                onChange={onChange}
              />
              <button type="submit" className="btn-primary"> Add DEX </button>
              <div className="error-field">{errorEl}</div>
            </form>
          </div>
        </div>
        <div className="owner__item">
          <h2> Account: </h2>
          <div className="owner__fields">
            <div className="owner__field field full">
              <input
                  type="text"
                  name="account"
                  className="field__input"
                  value={accountInput}
                  onChange={onChange}
              />
              <button
                  type="button"
                  className="btn-primary"
                  onClick={excludeAccount}
              >
                Exclude account
              </button>
              <button
                  type="button"
                  className="btn-primary"
                  onClick={includeAccount}
              >
                Include account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
