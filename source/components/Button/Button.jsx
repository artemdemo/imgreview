import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Button.less';

const Button = (props) => {
    const buttonClass = classnames({
        button: true,
        button_primary: props.primary,
        button_secondary: props.secondary,
    });
    return (
        <button
            title={props.title}
            onClick={props.onClick}
            className={buttonClass}
            type='button'
        >
            {props.children}
        </button>
    );
};

Button.propTypes = {
    title: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    title: null,
    primary: true,
    secondary: false,
    onClick: null,
};

export default Button;
