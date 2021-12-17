/* eslint-disable no-trailing-spaces */
import React, { ButtonHTMLAttributes } from 'react';
import classnames from 'classnames';
import './Button.less';

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
        Button: true,
        Button_primary: appearance === EButtonAppearance.PRIMARY || !appearance,
        Button_secondary: appearance === EButtonAppearance.SECONDARY,
        Button_block: block,
        Button_disabled: disabled,
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
