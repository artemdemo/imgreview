/* eslint-disable no-trailing-spaces */
import React from 'react';
import styled from 'styled-components'
import ClearButton from './ClearButton';

export enum EButtonAppearance {
    PRIMARY,
    SECONDARY,
}

type TProps = {
    appearance?: EButtonAppearance;
    disabled: boolean;
};

const Button = styled(ClearButton)<TProps>`
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    ${props => (!props.appearance || props.appearance === EButtonAppearance.PRIMARY) && `
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    `}
    ${props => props.appearance === EButtonAppearance.SECONDARY && `
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    `}
    ${props => props.disabled && `
        color: rgba(255, 255, 255, 0.5);
        background-color: rgba(108, 117, 125, 0.6);
        border-color: transparent;
        cursor: not-allowed;
    `}
`;

Button.defaultProps = {
    type: 'button',
    disabled: false,
};

export default Button;
