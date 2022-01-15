import React, {forwardRef, ButtonHTMLAttributes} from 'react';
import classnames from 'classnames';
import './ClearButton.less'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const ClearButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return <button {...props} ref={ref} className={classnames(ClearButton, props.className)} />;
});
