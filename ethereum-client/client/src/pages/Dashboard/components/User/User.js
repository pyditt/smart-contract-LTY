import React from "react";

import "./User.scss";

const User = (props) => {
  const getAddress = async () => {
    const res = await props.getAddress();
    console.log("getAddress", res);
  };

  const getDex = async () => {
    const res = await props.getDex();
    console.log("getDex", res);
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
              />
              <button type="button" className="btn-primary">
                {" "}
                Get balance{" "}
              </button>
            </div>
            <div className="user__balance">
              <span> Account balance: </span>
              <h2> 0 LTY</h2>
            </div>
          </div>
        </div>
        <div className="user__item columns">
          <div className="user__column">
            <h2> Get included accounts: </h2>
            <button type="button" className="btn-primary" onClick={getAddress}>
              {" "}
              Get address{" "}
            </button>
          </div>
          <div className="user__column">
            <h2> Get DEX accounts: </h2>
            <button type="button" className="btn-primary" onClick={getDex}>
              {" "}
              Get DEX{" "}
            </button>
          </div>
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
                {" "}
                Transfer{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
