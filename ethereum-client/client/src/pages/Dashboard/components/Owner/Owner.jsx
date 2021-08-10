import React, { useState } from "react";
import ExcludeAndInclude from "./components/excludeAndInclude";
import FieldSettingPrice from "./components/FieldSettingPrice";

import "./Owner.scss";
import * as Lib from "../../../../ledgityLib";

const Owner = ({ contract, account, updateInfo, ownership }) => {
  const [price, setPrice] = useState("");
  const [token, setToken] = useState("");
  const [dex, setDex] = useState("");
  const [excludeInclude] = useState([
    { title: 'Exclude/Include in RFI:' },
    { title: 'Exclude/Include in Fee' },
    { title: 'Exclude/Include in limits' }]);
  const [fieldSet] = useState([
    { title: 'Set number of tokens to swap:', flag: 'LTY', func: contract.setNumTokensToSwap.bind(contract) },
    { title: 'Set max transaction size:', flag: '%', func: contract.setMaxTransactionSizePercent.bind(contract) },
    { title: 'Set sell fee if price is < x10 IDO price', flag: '%', func: contract.setSellAtSmallPriceAccumulationFee.bind(contract) },
    { title: 'Set sell fee if price is > x10 IDO price', flag: '%', func: contract.setSellAccumulationFee.bind(contract) },
    { title: 'Set RFI fee', flag: '%', func: contract.setSellReflectionFee.bind(contract) },
    { title: 'Set buy fee', flag: '%', func: contract.setBuyAccumulationFee.bind(contract) }])

  const [errorPrice, setErrorPrice] = useState(null);
  const [errorDex, setErrorDex] = useState(null);
  const [errorToken, setErrorToken] = useState(null);

  const onChange = (event) => {
    setErrorPrice(null);
    setErrorDex(null);
    setErrorToken(null);

    switch (event.target.name) {
      case "price":
        return setPrice(event.target.value);
      case "token":
        return setToken(event.target.value);
      case "dex":
        return setDex(event.target.value);
      default:
        break;
    }
  };

  const applyPrice = async (event) => {
    event.preventDefault();
    setErrorPrice(null);

    try {
      // TODO: remove everything related to setPrice
      // await Lib.setPrice(contract, account, price);
      setPrice("");
      updateInfo();
    } catch (error) {
      if (error.code === 4001) {
        return setErrorPrice(<p>Transaction signature was denied.</p>);
      }
      setErrorPrice(<p>Something went wrong..</p>);
    }
  };

  const burnToken = async (event) => {
    event.preventDefault();
    setErrorToken(null);
    try {
      await Lib.burn(contract, token);
      setToken("");
      updateInfo();
    } catch (error) {
      if (error.code === 4001) {
        return setErrorToken(<p>Transaction signature was denied.</p>);
      }
      setErrorToken(<p> Incorrect token. </p>);
    }
  };

  const addDex = async (event) => {
    event.preventDefault();
    setErrorDex(null);
    try {
      const allDex = await Lib.getDex(contract);
      if (allDex.indexOf(dex) === -1) {
        await Lib.setDex(contract, dex);
        setDex("");
      } else {
        setErrorDex(<p> Such address already exists. </p>);
      }
    } catch (error) {
      if (error.code === 4001) {
        return setErrorToken(<p>Transaction signature was denied.</p>);
      }
      setErrorDex(<p> Incorrect address. Please, check it.. </p>);
    }
  };

  return (
    <div className="owner">
      {ownership ? (
        <h2 className="title"> Owner </h2>
      ) : (
        <div className="owner__head">
          <h2 className="title"> Owner </h2>
          <p>(Only for contract Owner)</p>
        </div>
      )}

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
                className={ownership ? "field__input" : "field__input disabled"}
                disabled={!ownership}
                placeholder="Enter price"
                value={price}
                onChange={onChange}
              />
              <button
                type="submit"
                className={ownership ? "btn-primary" : "btn-primary disabled"}
                disabled={!ownership}
              >
                Set
              </button>
              <div className="error-field"> {errorPrice} </div>
            </form>
            <form className="owner__field field" onSubmit={burnToken}>
              <label className="field__label" htmlFor="token">
                Burn token:
              </label>
              <input
                type="number"
                name="token"
                className={ownership ? "field__input" : "field__input disabled"}
                disabled={!ownership}
                value={token}
                onChange={onChange}
              />
              <button
                type="submit"
                className={ownership ? "btn-primary" : "btn-primary disabled"}
                disabled={!ownership}
              >
                Burn
              </button>
              <div className="error-field"> {errorToken} </div>
            </form>
            <form className="owner__field field" onSubmit={addDex}>
              <input
                type="text"
                placeholder="Enter address"
                name="dex"
                className={ownership ? "field__input" : "field__input disabled"}
                disabled={!ownership}
                value={dex}
                onChange={onChange}
              />
              <button
                type="submit"
                className={ownership ? "btn-primary" : "btn-primary disabled"}
                disabled={!ownership}
              >
                {" "}
                Add DEX{" "}
              </button>
              <div className="error-field">{errorDex}</div>
            </form>
          </div>
        </div>
        <div className="owner__item">
          {
            excludeInclude.map((el, index) =>
              <ExcludeAndInclude
                key={index}
                ownership={ownership}
                contract={contract}
                title={el.title} />)
          }
        </div>
        <div className="owner_set">
          {
            fieldSet.map((el, index) =>
              <FieldSettingPrice
                key={index}
                title={el.title}
                flag={el.flag}
                ownership={ownership}
                contract={contract}
                func={el.func} />)
          }
        </div>
      </div>
    </div>
  );
};

export default Owner;
