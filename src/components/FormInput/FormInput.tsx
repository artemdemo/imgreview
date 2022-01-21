import React, { forwardRef, InputHTMLAttributes } from 'react';
import './FormInput.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input {...props} ref={ref} className="form-input" />;
});

