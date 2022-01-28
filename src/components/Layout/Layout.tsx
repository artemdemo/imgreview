import React from 'react';
import s from './Layout.module.css';

export const Layout: React.FC = (props) => {
  const { children } = props;
  return (
    <div className={s.Layout}>{children}</div>
  );
};
