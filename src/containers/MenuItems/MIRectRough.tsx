import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import rectRoughImg from './img/rect-rough.svg';

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
};

type TState = {
    active: boolean;
};

const IconRectRough = styled.span`
    background-image: url(${rectRoughImg});
    width: 14px;
    height: 16px;
    background-repeat: no-repeat;
    display: block;
`;

class MIRectRough extends React.PureComponent<TProps, TState> {
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

    onClick = () => {
        const { menu } = this.props;
        canvasApi.startAddingShape({
            type: canvasApi.EShapeTypes.RECT_ROUGH,
            options: {
                strokeColor: menu.strokeColor,
                strokeWidth: menu.strokeWidth,
            },
        });

        this.setState({
            active: true,
        });

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.AddRectRough,
        });
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                active={this.state.active}
                title={t('menu.addRect')}
            >
                <IconRectRough />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    })
)(MIRectRough);
