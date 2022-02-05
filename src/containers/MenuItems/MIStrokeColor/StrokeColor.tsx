import React, { useContext, useEffect, useState } from 'react';
import Color from 'color';
import classnames from 'classnames';
import { AppStateContext } from '../../../model/AppStateContext';
import s from './StrokeColor.module.css';

export const StrokeColor: React.FC = () => {
  const {
    state: {
      menu: { strokeColor },
    },
  } = useContext(AppStateContext);
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    setIsTransparent(Color(strokeColor).alpha() < 0.15);
  }, [strokeColor]);

  return (
    <div
      className={classnames({
        [s.StrokeColor]: true,
        [s.StrokeColor_isTransparent]: isTransparent,
      })}
      style={{
        backgroundColor: strokeColor,
      }}
    >
      <div
        className={classnames({
          [s.StrokeColor__Plug]: true,
          [s.StrokeColor__Plug_isTransparent]: isTransparent,
        })}
      />
    </div>
  );
};
