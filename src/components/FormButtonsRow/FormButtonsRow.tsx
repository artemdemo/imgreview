import React from 'react';
import './FormButtonsRow.css';

const FormButtonsRow: React.FC = (props) => (
  <>
    {React.Children.map(props.children, (child) => (
      <div className="FormButtonsRow">{child}</div>
    ))}
  </>
);

export default FormButtonsRow;
