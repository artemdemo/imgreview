import React from 'react';

const MainMenuItem = props => (
    <div
        onClick={props.onClick}
        data-mock='Popup'
    >
        {props.children}
    </div>
);

export default MainMenuItem;
