import React, { FC } from "react";
import { Info } from '../../../../ledgityLib';

import "./Information.scss";

interface Props {
  info: Info
  loading: boolean
  updateInfo: () => void
}

const Information: FC<Props> = ({ info, loading, updateInfo }) => {
  const loadingElement = (
    <div style={{ color: "#fff", marginLeft: "15px" }}> Loading ... </div>
  );

  return (
    <div className="information">
      <div className="information__head">
        <h2 className="title"> Information </h2>
        <button type="button" onClick={updateInfo} className="reload"></button>
        {loading ? loadingElement : ""}
      </div>
      <div className="information__block">
        <div className="information__item">
          <h2> Transaction </h2>
          <div className="information__fields">
            <div className="information__field field">
              <div className="field__label"> Transaction size: </div>
              <div className="field__input"> {info.maxTokenTx} </div>
              <div className="field__note"> Max </div>
            </div>
            <div className="information__field field">
              <div className="field__label"> Tokens burned: </div>
              <div className="field__input"> {info.totalBurn} </div>
              <div className="field__note"> </div>
            </div>
            <div className="information__field field">
              <div className="field__label"> Total commission: </div>
              <div className="field__input"> {info.totalFees} </div>
              <div className="field__note" />
            </div>
          </div>
        </div>
        <div className="information__item">
          <h2> Price </h2>
          <div className="information__fields">
            <div className="information__field field">
              <div className="field__label"> Starting price: </div>
              <div className="field__input"> {info.startPrice} </div>
              <div className="field__note"> </div>
            </div>
            <div className="information__field field">
              <div className="field__label"> Current price: </div>
              <div className="field__input"> {info.price} </div>
              <div className="field__note"> </div>
            </div>
          </div>
        </div>
        <div className="information__item">
          <h2> How much has been released token </h2>
          <div className="information__fields">
            <div className="information__field field">
              <div className="field__input single"> {info.initialTotalSupply} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
