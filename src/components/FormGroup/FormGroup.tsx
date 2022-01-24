import React from 'react';
import s from './FormGroup.module.css';

type Props = {
  errorText?: string;
};

export const FormGroup: React.FC<Props> = (props) => {
  const { children, errorText } = props;
  return (
    <div className={s.FormGroup}>
      {children}
      {errorText !== '' ? (
        <div className={s.FormGroup__Error}>{errorText}</div>
      ) : null}
    </div>
  );
};
