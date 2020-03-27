import React from 'react';
import styled from 'styled-components';
import { mainMenuItemBorderColor } from '../../styles/variables';

type TWrapperProps = {
    show: boolean;
};

const SeparatorWrapper = styled.span<TWrapperProps>`
    display: ${props => props.show ? 'block' : 'none'};
    float: left;
    padding: 1px 0;
`;

const SeparatorContent = styled.span`
    border-right: 1px solid ${mainMenuItemBorderColor};
    margin-right: 5px;
`;

type TProps = {
    show: boolean;
};

const Separator = (props: TProps) => (
    <SeparatorWrapper show={props.show}>
        <SeparatorContent />
    </SeparatorWrapper>
);

Separator.defaultProps = {
    show: true,
};

export default Separator;
