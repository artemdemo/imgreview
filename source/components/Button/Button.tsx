/* eslint-disable no-trailing-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import ClearButton from './ClearButton';

const Button = styled(ClearButton)`
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
    ${props => props.primary && `
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    `}
    ${props => props.secondary && `
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

Button.propTypes = {
    type: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    type: 'button',
    primary: true,
    secondary: false,
    disabled: false,
};

export default Button;
