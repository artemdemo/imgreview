import React from 'react';

const TopMenuItem = (props) => (
  <div onClick={props.onClick} data-mock="TopMenuItem">
    {props.children}
  </div>
);

export default TopMenuItem;
