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
    };

    hasSubmenu() {
        const { subMenu } = this.props;
        return subMenu.length > 0;
    }

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
        const { disabled, show, active, onClick, href, title } = this.props;
        if (show) {
            return (
                <MenuButton
                    disabled={disabled}
                    active={active}
                    onClick={onClick}
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
