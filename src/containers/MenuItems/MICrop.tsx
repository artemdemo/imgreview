import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCrop} from "@fortawesome/free-solid-svg-icons";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import * as canvasApi from '../../../srcCanvas/api';
import * as gaService from "../../services/ganalytics";

type TProps = {
    disabled: boolean;
    show: boolean;
};

class MICrop extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    onClick = () => {
        canvasApi.cropSelected();

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ApplyCrop,
        });
    };

    render() {
        const { disabled, show } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                show={show}
            >
                <FontAwesomeIcon icon={faCrop} />
            </TopMenuItem>
        );
    }
}

export default MICrop;
