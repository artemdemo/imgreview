import React from 'react';
import styled, {css} from 'styled-components';
import * as styleVars from '../../styles/variables';
import ClearButton, {clearButtonCss} from '../Button/ClearButton';

const menuItemCss = css`
    background-color: ${styleVars.mainMenuColor};
    padding: 4px 6px;
    border-radius: 3px;
    float: left;
    margin-right: 5px;
    outline: none;
    display: flex;

    &:active, &:focus {
        outline: 0;
    }

    &:hover {
        background-color: #c5c5c5;
    }

    // @ts-ignore
    ${props => props.posRelative && `
        position: relative;
    `};

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
    className?: string;
    href?: string;
    type?: string;
    posRelative?: boolean;
};

type TProps = {
    disabled: boolean;
    href: string;
    className?: string;
    posRelative?: boolean;
    onClick: (e?: any) => void;
    children: any;
};

const MainItemWrap = (props: TProps) => {
    const { disabled, onClick, className, posRelative, href } = props;
    const ComponentWrap = href.length === 0 ? MainMenuItem : MainMenuItemLink;
    const wrapProps: TComponentWrap = {
        disabled,
        onClick,
        className,
        posRelative,
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
            {props.children}
        </ComponentWrap>
    );
};

export default MainItemWrap;
