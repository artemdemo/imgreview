import React, { forwardRef, InputHTMLAttributes } from 'react';
import s from './FormInput.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input {...props} ref={ref} className={s.FormInput} />;
});

FormInput.displayName = 'FormInput';
