import React from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import SubMenu, { TSubmenuData } from './SubMenu';
import ClearButton from '../Button/ClearButton';
import * as styleVars from '../../styles/variables';

const horizontalPadding = 4;

const MainMenuItemSty__Content = styled.span`
    flex-grow: 1;
    min-width: ${30 - 2 * horizontalPadding}px;
`;

const MainMenuItemSty__Caret = styled.span`
    flex-grow: 0;
    padding-left: 5px;
`;

const MainMenuItemSty__Submenu = styled.div`
    position: absolute;
    top: 100%;
    display: none;
    padding-top: 5px;
    z-index: ${styleVars.mainMenuZIndex};
`;

const MainMenuItemSty = styled(ClearButton)`
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
    
    &:hover ${MainMenuItemSty__Submenu} {
        display: block;
    }
    
    ${props => props.disabled && `
        opacity: 0.4;
        cursor: not-allowed;
    `}
`;

type Props = {
    subMenu: TSubmenuData;
    disabled: boolean;
    onClick: (e?: any) => void;
};

class TopMenuItem extends React.PureComponent<Props> {
    static readonly defaultProps = {
        onClick: null,
        disabled: null,
        subMenu: [],
    };

    renderCaret() {
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <MainMenuItemSty__Caret>
                    <Icon name='caret-down' />
                </MainMenuItemSty__Caret>
            );
        }

        return null;
    }

    renderSubMenu() {
        const { subMenu } = this.props;
        if (subMenu.length > 0) {
            return (
                <MainMenuItemSty__Submenu>
                    <SubMenu data={subMenu} />
                </MainMenuItemSty__Submenu>
            );
        }

        return null;
    }

    render() {
        const { disabled, onClick } = this.props;
        return (
            <MainMenuItemSty
                disabled={disabled}
                onClick={onClick}
                type='button'
            >
                <MainMenuItemSty__Content>
                    {this.props.children}
                </MainMenuItemSty__Content>
                {this.renderCaret()}
                {this.renderSubMenu()}
            </MainMenuItemSty>
        );
    }
}

export default TopMenuItem;
