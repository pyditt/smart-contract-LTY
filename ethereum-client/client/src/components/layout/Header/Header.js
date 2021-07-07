import React from 'react';

import './Header.scss';

const Header = () => {
    return (
        <header className="app-header">
            <div className="container">
                <div className="app-header__info">
                    <div className="balance">
                        <p className="balance__title">Balance:</p>
                        <div className="balance__item">
                            <div className="balance__token">
                                <img src="/images/lty.svg" alt="lty"/>
                                <span> LTY </span>
                            </div>
                            <div className="balance__price">
                                0
                            </div>
                        </div>
                        <div className="balance__item">
                            <div className="balance__token">
                                <img src="/images/eth.svg" alt="eth"/>
                                <span> ETH </span>
                            </div>
                            <div className="balance__price">
                                0
                            </div>
                        </div>
                    </div>
                    <div className="app-header__contract">
                        <button type="button" className="btn-secondary"> Contract details </button>
                    </div>
                </div>
                <div className="app-header__btns">
                    <button type="button" className="btn-secondary"> Add LTY to wallet </button>
                    <div className="app-header__account"> 0xe79...7445 </div>
                </div>
            </div>
        </header>
    )
};

export default Header;