import React from 'react';
import styled, {css} from "styled-components";
import * as styleVars from "../../styles/variables";
import ClearButton, {clearButtonCss} from "../Button/ClearButton";

const menuItemCss = css`
    background-color: ${styleVars.mainMenuColor};
    padding: 4px 6px;
    border: 1px solid ${styleVars.mainMenuItemBoderColor};
    border-radius: 3px;
    float: left;
    margin-right: 5px;
    outline: none;
    display: flex;

    // I'm disabling here relative position in order to place color selector inside of the button.
    // See MIStrokeSelector
    // This way when user open it - it will appear under the button and I don't need to care about 'left' property.
    //position: relative;

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
    disabled: boolean;
    href: string;
    onClick: (e?: any) => void;
    children: any;
};

const MainItemWrap = (props: TProps) => {
    const { disabled, onClick, href } = props;
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
            {props.children}
        </ComponentWrap>
    );
};

export default MainItemWrap;
