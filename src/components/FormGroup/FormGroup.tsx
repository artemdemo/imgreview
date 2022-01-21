import React from 'react';
import './FormGroup.css';

type Props = {
  errorText?: string;
};

export const FormGroup: React.FC<Props> = (props) => {
  const { children, errorText } = props;
  return (
    <div className="FormGroup">
      {children}
      {errorText !== '' ? (
        <div className="FormGroup__Error">{errorText}</div>
      ) : null}
    </div>
  );
};
