import React from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import SubMenu, { TSubmenuData } from './SubMenu';
import ClearButton from '../Button/ClearButton';
import * as styleVars from '../../styles/variables';

const horizontalPadding = 4;

const MainMenuItem__Content = styled.span`
    flex-grow: 1;
    min-width: ${30 - 2 * horizontalPadding}px;
`;

const MainMenuItem__Caret = styled.span`
    flex-grow: 0;
    padding-left: 5px;
`;

const MainMenuItem__Submenu = styled.div`
    position: absolute;
    top: 100%;
    display: none;
    padding-top: 5px;
    z-index: ${styleVars.mainMenuZIndex};
`;

const MainMenuItem = styled(ClearButton)`
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

    &:hover ${MainMenuItem__Submenu} {
        // Submenu shouldn't appear if MenuItem is disabled
        ${props => !props.disabled && `
            display: block;
        `}

    }

    ${props => props.disabled && `
        opacity: 0.4;
        cursor: not-allowed;
    `}
`;

type TProps = {
    subMenu: TSubmenuData;
    disabled: boolean;
    onClick: (e?: any) => void;
};

class TopMenuItem extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        onClick: null,
        disabled: null,
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
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <MainMenuItem__Submenu>
                    <SubMenu data={subMenu} />
                </MainMenuItem__Submenu>
            );
        }

        return null;
    }

    render() {
        const { disabled, onClick } = this.props;
        return (
            <MainMenuItem
                disabled={disabled}
                onClick={onClick}
                type='button'
            >
                <MainMenuItem__Content>
                    {this.props.children}
                </MainMenuItem__Content>
                {this.renderCaret()}
                {this.renderSubMenu()}
            </MainMenuItem>
        );
    }
}

export default TopMenuItem;
