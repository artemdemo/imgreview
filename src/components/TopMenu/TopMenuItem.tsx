import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import SubMenu, { TSubmenuData } from './SubMenu';
import MenuButton from './MenuButton';
import * as styleVars from '../../styles/variables';

const MainMenuItem__Content = styled.span`
    flex-grow: 1;
    min-width: 22px;
    text-align: center;
`;

const MainMenuItem__Caret = styled.span`
    flex-grow: 0;
    padding-left: 5px;
`;

const MainMenuItem__Submenu = styled.div`
    position: absolute;
    top: 100%;
    display: ${props => props.open ? 'block' : 'none'};
    padding-top: 5px;
    z-index: ${styleVars.mainMenuZIndex};
`;

type TProps = {
    subMenu: TSubmenuData;
    show: boolean;
    disabled: boolean;
    active?: boolean;
    open: boolean;
    href: string;
    title: string;
    onClick: (e?: any) => void;
    stopPropagation: boolean;
};

class TopMenuItem extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        onClick: null,
        show: true,
        disabled: false,
        open: false,
        href: '',
        title: '',
        subMenu: [],
        stopPropagation: true,
    };

    hasSubmenu() {
        const { subMenu } = this.props;
        return subMenu.length > 0;
    }

    onClick = (e) => {
        const {onClick, stopPropagation} = this.props;
        if (stopPropagation) {
            // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
            // I don't want ot menu to handle blurring, since I want that new arrow will stay in focus.
            e.stopPropagation();
        }
        onClick && onClick(e);
    };

    renderCaret() {
        if (this.hasSubmenu()) {
            return (
                <MainMenuItem__Caret>
                    <FontAwesomeIcon icon={faAngleDown} />
                </MainMenuItem__Caret>
            );
        }

        return null;
    }

    renderSubMenu() {
        const { subMenu, open } = this.props;
        if (this.hasSubmenu()) {
            return (
                <MainMenuItem__Submenu open={open}>
                    <SubMenu data={subMenu} />
                </MainMenuItem__Submenu>
            );
        }

        return null;
    }

    render() {
        const { disabled, show, active, href, title } = this.props;
        if (show) {
            return (
                <MenuButton
                    disabled={disabled}
                    active={active}
                    onClick={this.onClick}
                    href={href}
                    title={title}
                    posRelative={this.hasSubmenu()}
                >
                    <MainMenuItem__Content>
                        {this.props.children}
                    </MainMenuItem__Content>
                    {this.renderCaret()}
                    {this.renderSubMenu()}
                </MenuButton>
            );
        }
        return null;
    }
}

export default TopMenuItem;
