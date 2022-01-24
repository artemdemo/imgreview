import React from 'react';
import s from './FormButtonsRow.module.css';

const FormButtonsRow: React.FC = (props) => (
  <>
    {React.Children.map(props.children, (child) => (
      <div className={s.FormButtonsRow}>{child}</div>
    ))}
  </>
);

export default FormButtonsRow;
