import React from 'react';
import classnames from 'classnames';
import Icon from '../Icon/Icon';
import SubMenu, { TSubmenuData } from './SubMenu';

import './MainMenuItem.less';

type Props = {
    subMenu: TSubmenuData;
    disabled: boolean;
    onClick: (e?: any) => void;
};

class MainMenuItem extends React.PureComponent<Props> {
    static readonly defaultProps = {
        onClick: null,
        disabled: null,
        subMenu: [],
    };

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
                    <SubMenu data={subMenu} />
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

export default MainMenuItem;
