import React from "react";
import styled from "styled-components";
import TopMenuItem from "../../components/TopMenu/TopMenuItem";
import selectImg from "./img/select.svg";
import * as canvasApi from '../../../srcCanvas/api';
import * as shapesService from "../../services/shapes";
import * as gaService from "../../services/ganalytics";
import { t } from "../../services/i18n";

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

type TState = {
    active: boolean;
};

class MISelect extends React.PureComponent<TProps, TState> {
    static readonly defaultProps = {
        disabled: false,
    };

    #unsubShapeAdded;

    state = {
        active: false,
    };

    componentDidMount() {
        // @ts-ignore
        this.#unsubShapeAdded = canvasApi.shapeAdded.on(this.handleShapeAdded);
    }

    componentWillUnmount() {
        this.#unsubShapeAdded();
    }

    handleShapeAdded = () => {
        this.setState({
            active: false,
        });
    };

    onClick = (e) => {
        // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
        // I don't want ot menu to handle blurring, since I want that new arrow will stay in focus.
        e.stopPropagation();

        // And here I'm blurring shapes by myself,
        // since I want it to occur _before_ I'm adding new one.
        shapesService.blurShapes();

        canvasApi.startAddingShape(
            canvasApi.EShapeTypes.SELECT_RECT,
        );

        this.setState({
            active: true,
        });

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.AddSelectRect,
        });
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                active={this.state.active}
                title={t('menu.select')}
            >
                <IconSelect />
            </TopMenuItem>
        );
    }
}

export default MISelect;
