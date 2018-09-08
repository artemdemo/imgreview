import React from 'react';

const MainMenuItem = props => (
    <div
        onClick={props.onClick}
        data-mock='MainMenuItem'
    >
        {props.children}
    </div>
);

export default MainMenuItem;
