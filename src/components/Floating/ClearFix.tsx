import styled from 'styled-components';

const ClearFix = styled.div`
  &::after {
    content: '';
    display: table;
    clear: both;
  }
`;

export default ClearFix;
