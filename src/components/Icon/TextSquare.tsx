import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import withIconFont from './withIconFont';

const Stack = styled.span`
    zoom: 0.7;
    top: -5px;
    width: 1.6em;
    height: 1.1em;
    line-height: 1.7em;
    vertical-align: unset;
`;

type TProps = {
    title: string;
};

const TextSquare = (props: TProps) => {
    return (
        <Stack className='fa-stack' title={props.title}>
            <Icon name='square-o' className='fa-stack-2x' />
            <Icon name='font' className='fa-stack-1x' />
        </Stack>
    );
};

export default withIconFont(TextSquare);
