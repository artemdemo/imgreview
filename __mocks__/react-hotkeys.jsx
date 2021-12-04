import React from 'react';
import _omit from 'lodash/omit';

export const HotKeys = (props) => (
  <div data-mock="HotKeys">
    {JSON.stringify(_omit(props, ['children']), null, 2)}
    {props.children}
  </div>
);

export const GlobalHotKeys = (props) => (
  <div data-mock="GlobalHotKeys">
    {JSON.stringify(_omit(props, ['children']), null, 2)}
    {props.children}
  </div>
);
