import React, {forwardRef, ButtonHTMLAttributes} from 'react';
import classnames from 'classnames';
import s from './ClearButton.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ClearButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return <button {...props} ref={ref} className={classnames(s.ClearButton, props.className)} />;
});

ClearButton.displayName = 'ClearButton';
