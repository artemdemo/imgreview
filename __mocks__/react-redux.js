import React from 'react';

let lastMapStateToProp = null;
let lastMapActionsToProps = null;

export const connect = (mapStateToProps, mapActionsToProps) => {
  lastMapStateToProp = mapStateToProps;
  lastMapActionsToProps = mapActionsToProps;
  return (Component) => Component;
};

export const Provider = (props) => (
  <div data-mock="ReactReduxProvider">{props.children}</div>
);

export const __getLastMaps = () => ({
  mapStateToProps: lastMapStateToProp,
  mapActionsToProps: lastMapActionsToProps,
});
