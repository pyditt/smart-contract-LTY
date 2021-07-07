import React from 'react';

import './Modal.scss';

const Modal = ({ close, children }) => {
    return (
        <>
            <div className="overlay-bg" />
            <div className="modal">
                <div type="button" onClick={close} className="close-btn"> Х </div>
                {children}
            </div>
        </>
    )
}

export default Modal;