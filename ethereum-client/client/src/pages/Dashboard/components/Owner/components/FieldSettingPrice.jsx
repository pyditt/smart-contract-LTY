import React, { useState, useEffect } from "react";
import Decimal from 'decimal.js';
import { asPercent } from "../../../../../utils";

const FieldSettingPrice = ({ title, flag, ownership, contract, func }) => {
    const [field, setField] = useState('');
    const [limit, setLimit] = useState(null);
    const [error, setError] = useState('');

    const onChange = (event) => setField(event.target.value);

    const checkRuls = () => {
        const [numerator, denominator] = new Decimal(field).toFraction();
        if (flag === 'LTY') contract.setNumTokensToSwap(field);
        else {
            if (new Decimal(field).lte(limit)) {
                func(numerator.toString(), denominator.toString())
                setError('');
            }
            else setError('your number more than limit transaction');
        }
    }

    const save = () => {
        field === '' && setError('empty field');
        field !== '' && checkRuls();
    }

    useEffect(() => {
        if (title === 'Set sell fee if price is < x10 IDO price') contract.initialSellAtSmallPriceAccumulationFee().then(res => setLimit(asPercent(res)));
        if (title === 'Set sell fee if price is > x10 IDO price') contract.initialSellReflectionFee().then(res => setLimit(asPercent(res)));
        if (title === 'Set buy fee') contract.initialBuyAccumulationFee().then(res => setLimit(asPercent(res)));
        else contract.initialSellAccumulationFee().then(res => setLimit(asPercent(res)));
    }, []);

    return (
        <div className="owner_wrapper">
            <h2>{title}</h2>
            <div className="owner__field field">
                <label>
                    <input
                        type="number"
                        value={field}
                        onChange={onChange}
                        className={ownership ? "field__input" : "field__input disabled"}
                        onFocus={() => {
                            if (error !== '') {
                                setError('');
                                setField('');
                            }
                        }} />
                    <span className="flag">{flag}</span>
                </label>
                <button className={ownership ? "btn-primary" : "btn-primary disabled"} onClick={() => save()}>Save</button>
            </div>
            <div className="error-field">{error}</div>
        </div>
    )
}

export default FieldSettingPrice;