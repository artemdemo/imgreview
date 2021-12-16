/* eslint-disable no-trailing-spaces */
import React from 'react';
import ClearButton from './ClearButton';
import classnames from 'classnames';

export enum EButtonAppearance {
  PRIMARY,
  SECONDARY,
}

type ButtonProps = {
  appearance?: EButtonAppearance;
  block?: boolean;
  disabled: boolean;
};

const Button: React.FC<ButtonProps> = (props) => {
  const { disabled, appearance, children, block = false } = props;

  return (
    <ClearButton
      className={classnames({
        Button: true,
        Button_primary: appearance === EButtonAppearance.PRIMARY,
        Button_secondary: appearance === EButtonAppearance.SECONDARY,
        Button_block: block,
        Button_disabled: disabled,
      })}
      disabled={disabled}
      type="button"
    >
      {children}
    </ClearButton>
  );
};

export default Button;
