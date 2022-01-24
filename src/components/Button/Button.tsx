/* eslint-disable no-trailing-spaces */
import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import s from './Button.module.css';

export enum EButtonAppearance {
  PRIMARY,
  SECONDARY,
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: EButtonAppearance;
  block?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const {
    appearance,
    children,
    block = false,
    disabled,
    type = 'button',
    ...rest
  } = props;

  return (
    <button
      className={classnames({
        [s.Button]: true,
        [s.Button_primary]:
          appearance === EButtonAppearance.PRIMARY || !appearance,
        [s.Button_secondary]: appearance === EButtonAppearance.SECONDARY,
        [s.Button_block]: block,
        [s.Button_disabled]: disabled,
      })}
      disabled={disabled}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
