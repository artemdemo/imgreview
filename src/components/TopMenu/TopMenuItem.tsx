import React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../Icon/Icon';
import SubMenu, { TSubmenuData } from './SubMenu';
import ClearButton, { clearButtonCss } from '../Button/ClearButton';
import * as styleVars from '../../styles/variables';

const horizontalPadding = 4;

const MainMenuItem__Content = styled.span`
    flex-grow: 1;
    min-width: ${30 - 2 * horizontalPadding}px;
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

const menuItemCss = css`
    background-color: ${styleVars.mainMenuColor};
    padding: ${horizontalPadding}px 6px;
    border: 1px solid ${styleVars.mainMenuItemBoderColor};
    border-radius: 3px;
    float: left;
    margin-right: 5px;
    outline: none;
    display: flex;
    position: relative;

    &:active, &:focus {
        outline: 0;
    }

    // @ts-ignore
    ${props => props.disabled && `
        opacity: 0.4;
        cursor: not-allowed;
    `};
`;

const MainMenuItem = styled(ClearButton)`
    ${menuItemCss}
`;

const MainMenuItemLink = styled.a`
    ${clearButtonCss}
    ${menuItemCss}
`;

type TComponentWrap = {
    disabled: boolean;
    onClick: () => void;
    href?: string;
    type?: string;
};

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
        const ComponentWrap = href.length === 0 ? MainMenuItem : MainMenuItemLink;
        const wrapProps: TComponentWrap = {
            disabled,
            onClick,
        };
        if (href.length === 0) {
            wrapProps.type = 'button';
        } else {
            wrapProps.href = href;
        }
        return (
            <ComponentWrap
                {...wrapProps}
            >
                <MainMenuItem__Content>
                    {this.props.children}
                </MainMenuItem__Content>
                {this.renderCaret()}
                {this.renderSubMenu()}
            </ComponentWrap>
        );
    }
}

export default TopMenuItem;
