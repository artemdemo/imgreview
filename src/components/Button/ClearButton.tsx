import React from 'react';
import styled, { css } from 'styled-components';

export const clearButtonCss = css`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  cursor: pointer;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  /* Corrects inability to style clickable 'input' types in iOS */
  -webkit-appearance: none;
`;

const ClearButton = styled.button`
  ${clearButtonCss}
`;

export default ClearButton;
