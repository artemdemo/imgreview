import React from 'react';
import styled from 'styled-components';
import ClearFix from '../Floating/ClearFix';
import * as styleVars from '../../styles/variables';

const TopMenuPanel = styled(ClearFix)`
    padding: 4px 15px;
    background-color: ${styleVars.mainMenuColor};
    z-index: ${styleVars.mainMenuZIndex};
`;

export default TopMenuPanel;
