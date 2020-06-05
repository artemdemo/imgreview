import React from "react";
import styled from "styled-components";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import selectImg from "./img/select.svg";
import * as canvasApi from '../../../srcCanvas/api';
import * as shapesService from "../../services/shapes";

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
    onClick = (e) => {
        // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
        // I don'nt want ot menu to handle blurring, since I want that new arrow will stay in focus.
        e.stopPropagation();

        // And here I'm blurring shapes by myself,
        // since I want it to occur _before_ I'm adding new one.
        shapesService.blurShapes();

        canvasApi.createShape(
            canvasApi.EShapeTypes.SELECT_RECT,
        );
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                <IconSelect />
            </TopMenuItem>
        );
    }
}

export default MISelect;
