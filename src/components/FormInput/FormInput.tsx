import React, { forwardRef, InputHTMLAttributes } from 'react';
import './FormInput.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const FormInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input {...props} ref={ref} className="form-input" />;
});

export default FormInput;
