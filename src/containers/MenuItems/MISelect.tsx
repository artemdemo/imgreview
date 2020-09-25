import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import selectImg from './img/select.svg';
import * as canvasApi from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import {setShapeToAdd, TSetShapeToAdd} from '../../model/menu/menuActions';
import { t } from '../../services/i18n';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';

const IconSelect = styled.span`
    background-image: url(${selectImg});
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    display: block;
`;

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
    setShapeToAdd: TSetShapeToAdd;
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
        this.setState({ active: false });
    };

    onClick = () => {
        const { setShapeToAdd } = this.props;
        canvasApi.startAddingShape({
            type: canvasApi.EShapeTypes.SELECT_RECT,
        });

        setShapeToAdd(canvasApi.EShapeTypes.SELECT_RECT);

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.AddSelectRect,
        });
    };

    render() {
        const { disabled, menu } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.SELECT_RECT}
                title={t('menu.select')}
            >
                <IconSelect />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    }), {
        setShapeToAdd,
    },
)(MISelect);
