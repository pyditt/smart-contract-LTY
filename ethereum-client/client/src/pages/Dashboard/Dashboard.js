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
  loading,
}) => {
  return (
    <div className="container">
      <div className="app-main">
        <Information
            loading={loading}
            info={info}
            updateInfo={updateInfo}
        />
        <User
          getAddress={getAddress}
          getDex={getDex}
          contract={contract}
          account={account}
          updateInfo={updateInfo}
        />
        <Owner
            contract={contract}
            account={account}
            updateInfo={updateInfo}
        />
      </div>
    </div>
  );
};

export default Dashboard;
