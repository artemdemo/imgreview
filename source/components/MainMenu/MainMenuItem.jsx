import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

import './MainMenuItem.less';

class MainMenuItem extends React.PureComponent {
    renderCaret() {
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <span className='main-menu-item__caret'>
                    <Icon name='caret-down' />
                </span>
            );
        }

        return null;
    }

    renderSubMenu() {
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <div className='main-menu-item-submenu'>
                    <div className='main-menu-item-submenu-body'>
                        {subMenu.map(item => (
                            <div
                                onClick={() => {
                                    item.onClick(item);
                                }}
                                className='main-menu-item-submenu__item'
                                key={`main-menu-item-submenu__item-${item.text}`}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        const { disabled, onClick } = this.props;
        const buttonClass = classnames({
            'main-menu-item': true,
            'main-menu-item_disabled': disabled,
        });
        return (
            <button
                className={buttonClass}
                disabled={disabled}
                type='button'
                onClick={onClick}
            >
                <span
                    className='main-menu-item__content'
                >
                    {this.props.children}
                </span>
                {this.renderCaret()}
                {this.renderSubMenu()}
            </button>
        );
    }
}

MainMenuItem.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    subMenu: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string,
        onClick: PropTypes.func,
    })),
};

MainMenuItem.defaultProps = {
    onClick: null,
    disabled: null,
    subMenu: [],
};

export default MainMenuItem;
