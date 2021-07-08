import React from "react";
import { Information, Owner, User } from "./components";

import "./Dashboard.scss";

const Dashboard = ({ info, getTokenBalance, getAddress, getDex, contract }) => {
  return (
    <div className="container">
      <div className="app-main">
        <Information info={info} />
        <User getAddress={getAddress} getDex={getDex} contract={contract} getTokenBalance={getTokenBalance} />
        <Owner />
      </div>
    </div>
  );
};

export default Dashboard;
