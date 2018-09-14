import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './MainMenuItem.less';

class MainMenuItem extends React.PureComponent {
    onClick = () => {
        const { onClick } = this.props;
        onClick && onClick();
    };

    render() {
        const { disabled, right } = this.props;
        const buttonClass = classnames({
            'main-menu-item': true,
            'main-menu-item_disabled': disabled,
            'main-menu-item_right': right,
        });
        return (
            <button
                className={buttonClass}
                disabled={disabled}
                onClick={this.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}

MainMenuItem.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    right: PropTypes.bool,
};

MainMenuItem.defaultProps = {
    onClick: null,
    disabled: null,
    right: false,
};

export default MainMenuItem;
