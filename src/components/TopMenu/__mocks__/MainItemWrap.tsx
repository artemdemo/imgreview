import React from 'react';
import _omit from 'lodash/omit';

const MainItemWrap = props => (
    <div data-mock='MainItemWrap'>
        {JSON.stringify(_omit(props, 'children'), null, 2)}
        {props.children}
    </div>
);

export default MainItemWrap;
