import React, { useState } from "react";
import Form from "../../ui/Form";

const ApplyPrice = ({ updateInfo, ownership }) => {
    const [errorPrice, setErrorPrice] = useState(null);

    const checkError = (error) => {
        error === 4001 && setErrorPrice(<p>Transaction signature was denied.</p>);
        error !== 4001 && setErrorPrice(<p>Something went wrong..</p>);
    }

    const applyPrice = async (event, func) => {
        event.preventDefault();
        setErrorPrice(null);
        func('');
        try {
            // TODO: remove everything related to setPrice
            // await Lib.setPrice(contract, account, price);
            updateInfo();
        } catch (error) { checkError(error.code) }
    };

    return (
        <Form
            func={applyPrice}
            title={'Set a price:'}
            ownership={ownership}
            error={errorPrice}
            active={'Set'} />
    )
}

export default ApplyPrice;