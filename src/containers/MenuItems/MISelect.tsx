import React from "react";
import styled from "styled-components";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import selectImg from "./img/select.svg";

const IconSelect = styled.span`
    background-image: url(${selectImg});
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    display: block;
`;

type TProps = {
    disabled: boolean;
};

class MISelect extends React.PureComponent<TProps> {
    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                disabled={disabled}
            >
                <IconSelect />
            </TopMenuItem>
        );
    }
}

export default MISelect;
