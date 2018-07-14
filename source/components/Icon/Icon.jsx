import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Icon.less';

/**
 *
 * @param props
 * @return {*}
 * @link https://fontawesome.com/get-started
 */
const Icon = (props) => {
    const { name, inText, className } = props;

    if (name === '') {
        throw new Error('Icon prop `name` couldn\'t be empty');
    }

    const iconClass = classnames(className, 'fa', {
        [`fa-${name}`]: true,
        'icon_in-text': inText,
    });
    return (
        <span className={iconClass} />
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    inText: PropTypes.bool,
};

Icon.defaultProps = {
    className: '',
    inText: false,
};

export default Icon;
