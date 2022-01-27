import React, { useContext } from 'react';
import { AppStateContext } from '../../model/AppStateContext';

export const Page: React.FC = (props) => {
  const { children } = props;
  const {
    state: { menu },
  } = useContext(AppStateContext);
  return <div style={{ paddingTop: menu.menuHeight }}>{children}</div>;
};
