import React from 'react';

import './Connect.scss';

const Connect = () => {
    return (
        <div className="connect">
            <div className="container">
                <img src="/images/blockchain.svg" alt="Blockchain"/>
                <div className="connect__info">
                    <button type="button" className="btn-primary"> Connect Metamask </button>
                    <p> please connect first </p>
                </div>
                <img src="/images/prive.svg" alt="prive"/>
            </div>
        </div>
    )
}
export default Connect;