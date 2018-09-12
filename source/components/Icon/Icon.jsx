import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Icon.less';

/**
 * Icon component
 * @param props
 * @link https://fontawesome.com/get-started
 */
const Icon = (props) => {
    const { name, inText, className, title } = props;

    if (name === '' || name == null) {
        throw new Error('Icon prop `name` couldn\'t be empty');
    }

    const iconClass = classnames(className, 'fa', {
        [`fa-${name}`]: true,
        'icon_in-text': inText,
    });
    return (
        <span
            className={iconClass}
            title={title}
        />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
    inText: PropTypes.bool,
};

Icon.defaultProps = {
    className: '',
    title: null,
    inText: false,
};

export default Icon;
