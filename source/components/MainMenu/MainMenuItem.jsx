import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

import './MainMenuItem.less';

class MainMenuItem extends React.PureComponent {
    onClick = () => {
        const { item, onClick } = this.props;
        onClick && onClick(item);
    };

    render() {
        const { item, disabled } = this.props;
        const buttonClass = classnames({
            'main-menu-item': true,
            'main-menu-item_disabled': disabled,
        });
        return (
            <button
                className={buttonClass}
                disabled={disabled}
                onClick={this.onClick}
            >
                <Icon name={item.icon} />
            </button>
        );
    }
}

MainMenuItem.propTypes = {
    item: PropTypes.shape({
        icon: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

MainMenuItem.defaultProps = {
    onClick: null,
    disabled: null,
};

export default MainMenuItem;
