/* eslint-disable no-trailing-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Button.less';

const Button = (props) => {
    const buttonClass = classnames({
        button: true,
        button_primary: props.primary,
        button_secondary: props.secondary,
        button_disabled: props.disabled,
    });
    return (
        <button
            title={props.title}
            onClick={props.onClick}
            className={buttonClass}
            disabled={props.disabled}
            type={props.type}
        >
            {props.children}
        </button>
    );
};

Button.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    title: null,
    type: 'button',
    primary: true,
    secondary: false,
    disabled: false,
    onClick: null,
};

export default Button;
