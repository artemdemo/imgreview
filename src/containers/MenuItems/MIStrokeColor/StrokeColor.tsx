import React, { useContext } from 'react';
import { AppStateContext } from '../../../model/AppStateContext';
import s from './StrokeColor.module.css';

export const StrokeColor: React.FC = () => {
  const {
    state: { menu },
  } = useContext(AppStateContext);

  return (
    <div
      className={s.StrokeColor}
      style={{
        backgroundColor: menu.strokeColor,
      }}
    >
      <div className={s.StrokeColor__Plug} />
    </div>
  );
};
