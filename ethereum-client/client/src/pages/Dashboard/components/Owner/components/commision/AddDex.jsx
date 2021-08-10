import React, { useState } from "react";
import Form from "../../ui/Form";
import * as Lib from "../../../../../../ledgityLib";

const AddDex = ({ ownership, contract }) => {
    const [errorDex, setErrorDex] = useState(null);

    const checkError = (error) => {
        error === 4001 && setErrorDex(<p>Transaction signature was denied.</p>);
        error !== 4001 && setErrorDex(<p> Incorrect address. Please, check it.. </p>);
    }


    const addDex = async (event, func, value) => {
        event.preventDefault();
        setErrorDex(null);
        try {
            const allDex = await Lib.getDex(contract);
            if (allDex.includes(value)) {
                await Lib.setDex(contract, value);
                func("");
            } else {
                setErrorDex(<p> Such address already exists. </p>);
            }
        } catch (error) { checkError(error.code); }
    };


    return (
        <Form erro={errorDex} func={addDex} ownership={ownership} active={'Add DEX'} />
    )
}

export default AddDex;