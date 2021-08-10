import React, { Fragment, useState } from "react";
import * as Lib from "../../../../../ledgityLib";

const ExcludeAndInclude = ({ ownership, title, contract, func, flag }) => {
  const [accountInput, setAccountInput] = useState("");
  const [errorAccount, setErrorAccount] = useState(null);

  const onChange = (event) => setAccountInput(event.target.value);

  const onFocus = () => setErrorAccount(null);

  const errorDefinition = (code) => {
    code === 4001 && setErrorAccount(<p>Transaction signature was denied.</p>);
    code !== 4001 &&
      setErrorAccount(<p> Incorrect account. Please, check it.. </p>);
  };

  const excludeAccount = async () => {
    setErrorAccount(null);
    try {
      const allExcluded = await Lib.getExcluded(contract);
      if (allExcluded.includes(accountInput)) {
        if (flag) await func(contract, accountInput);
        else await func(accountInput, true);
        setAccountInput("");
      } else setErrorAccount(<p> Such account is already excluded. </p>);
    } catch (error) {
      errorDefinition(error.code);
    }
  };

  const includeAccount = async () => {
    setErrorAccount(null);
    try {
      const allExcluded = await Lib.getExcluded(contract);
      if (allExcluded.includes(accountInput)) {
        if (flag) await func(contract, accountInput);
        else await func(accountInput, false);
        setAccountInput("");
      }
    } catch (error) {
      errorDefinition(error.code);
    }
  };

  return (
    <Fragment>
      <h2>{title}</h2>
      <div className="owner__fields">
        <div className="owner__field field full">
          <input
            type="text"
            name="account"
            className={ownership ? "field__input" : "field__input disabled"}
            disabled={!ownership}
            value={accountInput}
            onChange={onChange}
            onFocus={onFocus}
          />
          <button
            type="button"
            className={ownership ? "btn-primary" : "btn-primary disabled"}
            disabled={!ownership}
            onClick={excludeAccount}
          >
            Exclude account
          </button>
          <button
            type="button"
            className={ownership ? "btn-primary" : "btn-primary disabled"}
            disabled={!ownership}
            onClick={includeAccount}
          >
            Include account
          </button>
          <div className="error-field">{errorAccount}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default ExcludeAndInclude;
