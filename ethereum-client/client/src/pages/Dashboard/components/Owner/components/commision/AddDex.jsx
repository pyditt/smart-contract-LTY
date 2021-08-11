import React, { useState } from "react";

const AddDex = ({ ownership, contract }) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(null);

    const checkError = (error) => {
        error === 4001 && setError(<p>Transaction signature was denied.</p>);
        error !== 4001 && setError(<p> Incorrect address. Please, check it.. </p>);
    }


    const addDex = async (value) => {
        setError(null);
        try {
            const allDex = await contract.getDexes()
            if (allDex.includes(value)) {
                setError(<p> Such address is already a DEX. </p>);
                return;
            }
            await contract.setDex(value, true);
        } catch (error) {
          console.error(error)
          checkError(error.code);
        }
    };


    return (
        <form className="owner__field field" onSubmit={async (e) => {
            e.preventDefault()
            await addDex(value)
        }}>
            <input
                className={ownership ? "field__input" : "field__input disabled"}
                disabled={!ownership}
                placeholder="Enter address"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                type="submit"
                className={ownership ? "btn-primary" : "btn-primary disabled"}
                disabled={!ownership}
            >
                Add Dex
            </button>
            <div className="error-field">{error}</div>
        </form>
    )
}

export default AddDex;
