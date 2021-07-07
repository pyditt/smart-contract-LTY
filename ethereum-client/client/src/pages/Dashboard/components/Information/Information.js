import React from 'react';

import './Information.scss';

const Information = () => {
    return (
        <div className="information">
            <h2 className="title"> Information </h2>
            <div className="information__block">
                <div className="information__item">
                    <h2> Transaction </h2>
                    <div className="information__fields">
                        <div className="information__field field">
                            <div className="field__label">  Transaction size: </div>
                            <div className="field__input"> 100000000000000000 </div>
                            <div className="field__note"> Max </div>
                        </div>
                        <div className="information__field field">
                            <div className="field__label">  Tokens burned: </div>
                            <div className="field__input">  </div>
                            <div className="field__note"> Fix </div>
                        </div>
                        <div className="information__field field">
                            <div className="field__label">  Total commission: </div>
                            <div className="field__input">  </div>
                            <div className="field__note" />
                        </div>
                    </div>
                </div>
                <div className="information__item">
                    <h2> Price </h2>
                    <div className="information__fields">
                        <div className="information__field field">
                            <div className="field__label">  Starting price: </div>
                            <div className="field__input">  </div>
                            <div className="field__note">  </div>
                        </div>
                        <div className="information__field field">
                            <div className="field__label"> Current price: </div>
                            <div className="field__input">  </div>
                            <div className="field__note"> </div>
                        </div>
                    </div>
                </div>
                <div className="information__item">
                    <h2> How much has been released token </h2>
                    <div className="information__fields">
                        <div className="information__field field">
                            <div className="field__input single">  </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Information;