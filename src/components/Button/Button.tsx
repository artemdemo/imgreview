/* eslint-disable no-trailing-spaces */
import React, {ButtonHTMLAttributes} from 'react';
import ClearButton from './ClearButton';
import classnames from 'classnames';

export enum EButtonAppearance {
  PRIMARY,
  SECONDARY,
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: EButtonAppearance;
  block?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const { appearance, children, block = false, disabled, type = 'button', ...rest } = props;

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
      type={type}
      {...rest}
    >
      {children}
    </ClearButton>
  );
};

export default Button;
