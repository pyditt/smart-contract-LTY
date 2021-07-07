import React from "react";
import { Information, Owner, User } from "./components";

import "./Dashboard.scss";

const Dashboard = (props) => {
  return (
    <div className="container">
      <div className="app-main">
        <Information info={props.info} />
        <User getAddress={props.getAddress} getDex={props.getDex} />
        <Owner />
      </div>
    </div>
  );
};

export default Dashboard;
