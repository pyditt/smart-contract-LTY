import React, { useState, useEffect } from "react";
import Decimal from 'decimal.js';
import { asPercent } from "../../../../../utils";

const FieldSettingPrice = ({ title, flag, ownership, func, getLimit }) => {
    const [field, setField] = useState('');
    const [limit, setLimit] = useState(null);
    const [error, setError] = useState('');

    const onChange = (event) => setField(event.target.value);

    const save = async () => {
        setError('');

        if (field === '') {
            setError('empty field');
            return
        }

        if (flag === 'LTY') {
            // Just a number, do not do anything else
            await func(field);
            return
        }

        const percent = new Decimal(field).div(100)
        if (limit != null && percent.gt(limit)) {
            setError(`your number more than limit: ${limit.mul(100)}%`);
            return
        }
        if (percent.lt(0) || percent.gt(1)) {
            setError('percentage from 0 to 100');
            return
        }

        const [numerator, denominator] = percent.toFraction()
        await func(numerator.toString(), denominator.toString());
    }

    useEffect(() => {
        getLimit && getLimit().then(res => setLimit(asPercent(res)));
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
