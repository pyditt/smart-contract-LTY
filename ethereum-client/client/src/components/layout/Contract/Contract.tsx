import React, { FC } from 'react';
import { Info } from '../../../ledgityLib';

import './Contract.scss';

interface Props {
  info: Info
}

const Contract: FC<Props> = ({ info }) => {
    const { owner, symbol, name, totalSupply, decimals, maxTokenTx, totalFees, startPrice, totalBurn } = info;

    const renderTokenSymbol = (symbol: string) => {
        switch (symbol) {
            case 'LTY': return <img src="/images/lty.svg" alt="lty"/>
            case 'ETH': return <img src="/images/eth.svg" alt="eth" />
            default: break;
        }
    }

    const tokenSymbol = renderTokenSymbol(info.symbol);

    return (
        <div className="contract">
            <div className="contract__owner">
                <div className="contract__image">
                    <img src="/images/user.svg" alt="owner"/>
                </div>
                <div className="contract__owner-info">
                    <p className="contract__address"> { owner } </p>
                    <p className="contract__note"> Owner </p>
                </div>
            </div>
            <div className="contract__token-info">
                <div className="contract__token">
                    {tokenSymbol}
                    <span> {symbol} </span>
                    <span className="contract__note"> {`${name.toLowerCase()} token`} </span>
                </div>
                <div className="contract__decimals">
                    <p> Decimals: {decimals} </p>
                </div>
            </div>
            <div className="contract__form">
                {/* TODO: can we bring this back? */}
                {/* <div className="contract__field">
                    <p className="contract__label bold"> How much has been released token: </p>
                    <div className="contract__input"> {allSupply} </div>
                </div> */}
                <div className="contract__field">
                    <p className="contract__label bold"> Total supply: </p>
                    <div className="contract__input"> {totalSupply} </div>
                </div>
                <div className="contract__field combine">
                    <p className="contract__label"> Transaction size max: </p>
                    <div className="contract__input half"> {maxTokenTx} </div>
                </div>
                <div className="contract__field half">
                    <p className="contract__label green"> Total commission: </p>
                    <div className="contract__input"> {totalFees} </div>
                </div>
                <div className="contract__field half">
                    <p className="contract__label red"> Tokens burned: </p>
                    <div className="contract__input"> {totalBurn} </div>
                </div>
                {/* TODO: can we implement this? Maybe use our oracle? */}
                {/* <div className="contract__field half">
                    <p className="contract__label"> Current price: </p>
                    <div className="contract__input"> {price} </div>
                </div> */}
                <div className="contract__field half">
                    <p className="contract__label"> Starting price: </p>
                    <div className="contract__input"> {startPrice} </div>
                </div>
            </div>
        </div>
    )
};

export default Contract;
