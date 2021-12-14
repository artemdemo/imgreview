import React, { InputHTMLAttributes } from 'react';

import './FormInput.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const FormInput: React.FC<Props> = (props) => {
  return <input {...props} className="form-input" />;
};

export default FormInput;
