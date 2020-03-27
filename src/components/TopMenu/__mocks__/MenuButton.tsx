import React from 'react';
import _omit from 'lodash/omit';

const MenuButton = props => (
    <div data-mock='MenuButton'>
        {JSON.stringify(_omit(props, 'children'), null, 2)}
        {props.children}
    </div>
);

export default MenuButton;
