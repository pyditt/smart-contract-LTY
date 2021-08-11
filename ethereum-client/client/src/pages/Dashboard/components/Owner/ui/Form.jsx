import React, { useState } from "react";

const Form = ({ func, ownership, error, title, active }) => {
    const [val, setVal] = useState('');

    const onChange = (event) => setVal(event.target.value);

    const send = (event) => func(event, setVal, val);
    return (
        <form className="owner__field field" onSubmit={send}>
            {
                title && <label className="field__label" htmlFor="price">
                    {title}
                </label>
            }
            <input
                type="number"
                name="price"
                className={ownership ? "field__input" : "field__input disabled"}
                disabled={!ownership}
                placeholder="Enter price"
                value={val}
                onChange={onChange}
            />
            <button
                type="submit"
                className={ownership ? "btn-primary" : "btn-primary disabled"}
                disabled={!ownership}
            >
                {active}
            </button>
            <div className="error-field">{error}</div>
        </form>
    )
}

export default Form;