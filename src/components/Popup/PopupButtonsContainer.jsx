import React from 'react';

import './PopupButtonsContainer.less';

const PopupButtonsContainer = props => (
    <div className='popup-buttons-container'>
        {props.children}
    </div>
);

export default PopupButtonsContainer;
