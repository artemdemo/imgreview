import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCrop} from "@fortawesome/free-solid-svg-icons";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import * as shapesService from "../../services/shapes";

type TProps = {
    disabled: boolean;
    show: boolean;
};

class MICrop extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    onClick = (e) => {
        // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
        // I don'nt want ot menu to handle blurring, since I want that new arrow will stay in focus.
        e.stopPropagation();

        // And here I'm blurring shapes by myself,
        // since I want it to occur _before_ I'm adding new one.
        shapesService.blurShapes();
    };

    render() {
        const { disabled, show } = this.props;
        if (show) {
            return (
                <TopMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={faCrop} />
                </TopMenuItem>
            );
        }
        return null;
    }
}

export default MICrop;
