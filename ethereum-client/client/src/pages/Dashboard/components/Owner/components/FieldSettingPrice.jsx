import React, { useState, useEffect } from "react";
import Decimal from 'decimal.js';
import { asPercent } from "../../../../../utils";

const FieldSettingPrice = ({ title, flag, ownership, contract, func, id, getLimit }) => {
    const [field, setField] = useState('');
    const [limit, setLimit] = useState(null);
    const [error, setError] = useState('');

    const onChange = (event) => setField(event.target.value);

    const checkRuls = () => {
        if (flag === 'LTY') contract.setNumTokensToSwap(field);
        else {
            const [numerator, denominator] = new Decimal(field).toFraction();
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
        getLimit && getLimit().then(res => setLimit(asPercent(res)))
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