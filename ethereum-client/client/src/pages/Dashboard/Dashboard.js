import React from "react";
import { Information, Owner, User } from "./components";

import "./Dashboard.scss";

const Dashboard = ({
  account,
  info,
  getAddress,
  getDex,
  contract,
  updateInfo,
}) => {
  return (
    <div className="container">
      <div className="app-main">
        <Information info={info} />
        <User
          getAddress={getAddress}
          getDex={getDex}
          contract={contract}
          account={account}
          updateInfo={updateInfo}
        />
        <Owner />
      </div>
    </div>
  );
};

export default Dashboard;
