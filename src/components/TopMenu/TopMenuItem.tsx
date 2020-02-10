import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../Icon/Icon';
import SubMenu, { TSubmenuData } from './SubMenu';
import MainItemWrap from './MainItemWrap';
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
    disabled: boolean;
    open: boolean;
    href: string;
    onClick: (e?: any) => void;
};

class TopMenuItem extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        onClick: null,
        disabled: false,
        open: false,
        href: '',
        subMenu: [],
    };

    renderCaret() {
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <MainMenuItem__Caret>
                    <Icon name='caret-down' />
                </MainMenuItem__Caret>
            );
        }

        return null;
    }

    renderSubMenu() {
        const { subMenu, open } = this.props;
        if (subMenu.length > 0) {
            return (
                <MainMenuItem__Submenu open={open}>
                    <SubMenu data={subMenu} />
                </MainMenuItem__Submenu>
            );
        }

        return null;
    }

    render() {
        const { disabled, onClick, href } = this.props;
        return (
            <MainItemWrap
                disabled={disabled}
                onClick={onClick}
                href={href}
            >
                <MainMenuItem__Content>
                    {this.props.children}
                </MainMenuItem__Content>
                {this.renderCaret()}
                {this.renderSubMenu()}
            </MainItemWrap>
        );
    }
}

export default TopMenuItem;
