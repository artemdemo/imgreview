import React, { CSSProperties } from 'react';
import s from './Layout.module.css';

type Props = {
  gap?: string;
};

export const Layout: React.FC<Props> = (props) => {
  const { children, gap } = props;
  const style: CSSProperties = {};
  if (gap) {
    style.gap = gap;
  }
  return (
    <div style={style} className={s.Layout}>
      {children}
    </div>
  );
};
