import React from 'react';
import { Information, Owner, User } from "./components";

import './Dashboard.scss';

const Dashboard = () => {
    return (
        <div className="container">
            <div className="app-main">
                <Information />
                <User />
                <Owner />
            </div>
        </div>
    );
};

export default Dashboard;