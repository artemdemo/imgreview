import React from "react";
import {connect} from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import * as canvasApi from '../../../srcCanvas/api';
import * as shapesService from "../../services/shapes";
import {TReduxState} from "../../reducers";
import {TStateMenu} from "../../model/menu/menuReducer";

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
};

class MIRect extends React.PureComponent<TProps> {
    onClick = (e) => {
        // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
        // I don'nt want ot menu to handle blurring, since I want that new arrow will stay in focus.
        e.stopPropagation();

        // And here I'm blurring shapes by myself,
        // since I want it to occur _before_ I'm adding new one.
        shapesService.blurShapes();

        const { menu } = this.props;
        canvasApi.createRect({
            strokeColor: menu.strokeColor,
            strokeWidth: 2,
        });
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faSquare} />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    })
)(MIRect);