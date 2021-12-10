import React from 'react';
import styled from 'styled-components';

const FormButtonSty = styled.div`
  margin-right: 14px;
  display: inline-block;

  &:last-child {
    margin-right: 0;
  }
`;

const FormButtonsRow: React.FC = (props) => (
  <>
    {React.Children.map(props.children, (child) => (
      <FormButtonSty>{child}</FormButtonSty>
    ))}
  </>
);

export default FormButtonsRow;
