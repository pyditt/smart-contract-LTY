import React, { useState } from "react";
import Form from "../../ui/Form";
import * as Lib from "../../../../../../ledgityLib";

const BurnToken = ({ updateInfo, ownership, contract }) => {
    const [errorToken, setErrorToken] = useState(null);

    const checkError = (error) => {
        error === 4001 && setErrorToken(<p>Transaction signature was denied.</p>);
        error !== 4001 && setErrorToken(<p> Incorrect token. </p>);
    }

    const burnToken = async (event, func, token) => {
        event.preventDefault();
        setErrorToken(null);
        try {
            await Lib.burn(contract, token);
            func("");
            updateInfo();
        } catch (error) { checkError(error.code) }
    };

    return (
        <Form ownership={ownership} func={burnToken} title={' Burn token:'} active={'Burn'} error={errorToken} />
    )
};

export default BurnToken;