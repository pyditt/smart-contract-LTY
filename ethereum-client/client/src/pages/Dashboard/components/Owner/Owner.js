import React from "react";

import "./Owner.scss";

const Owner = () => {
  return (
    <div className="owner">
      <h2 className="title"> Owner </h2>
      <div className="owner__block">
        <div className="owner__item commission">
          <h2> Get the balance of the Address: </h2>
          <div className="owner__fields">
            <form className="owner__field field">
              <label className="field__label" htmlFor="price">
                {" "}
                Set a price:{" "}
              </label>
              <input
                type="number"
                name="price"
                className="field__input"
                placeholder="Enter price"
              />
              <button type="submit" className="btn-primary">
                {" "}
                Set{" "}
              </button>
            </form>
            <form className="owner__field field">
              <label className="field__label" htmlFor="token">
                {" "}
                Burn token:{" "}
              </label>
              <input type="text" name="token" className="field__input" />
              <button type="submit" className="btn-primary">
                {" "}
                Burn{" "}
              </button>
            </form>
            <form className="owner__field field">
              <input
                type="text"
                placeholder="Enter address"
                name="dex"
                className="field__input"
              />
              <button type="submit" className="btn-primary">
                {" "}
                Add DEX{" "}
              </button>
            </form>
          </div>
        </div>
        <div className="owner__item">
          <h2> Account: </h2>
          <div className="owner__fields">
            <form className="owner__field field full">
              <input type="number" name="account" className="field__input" />
              <button type="button" className="btn-primary">
                {" "}
                Enable account{" "}
              </button>
              <button type="button" className="btn-primary">
                {" "}
                Eclude account{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
