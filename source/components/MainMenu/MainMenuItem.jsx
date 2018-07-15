import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

import './MainMenuItem.less';

class MainMenuItem extends React.PureComponent {
    onClick = () => {
        const { onClick } = this.props;
        onClick && onClick();
    };

    render() {
        const { item } = this.props;
        return (
            <button
                className='main-menu-item'
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
};

MainMenuItem.defaultProps = {
    onClick: null,
};

export default MainMenuItem;
