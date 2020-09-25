import React from 'react';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import {setShapeToAdd, TSetShapeToAdd} from '../../model/menu/menuActions';

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
    setShapeToAdd: TSetShapeToAdd;
};

type TState = {
    active: boolean;
};

class MIRect extends React.PureComponent<TProps, TState> {
    static readonly defaultProps = {
        disabled: false,
    };

    #unsubShapeAdded;

    state = {
        active: false,
    };

    componentDidMount() {
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
        const { menu, setShapeToAdd } = this.props;
        canvasApi.startAddingShape({
            type: canvasApi.EShapeTypes.RECT,
            options: {
                strokeColor: menu.strokeColor,
                strokeWidth: menu.strokeWidth,
            },
        });

        setShapeToAdd(canvasApi.EShapeTypes.RECT);

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.AddRect,
        });
    };

    render() {
        const { disabled, menu } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.RECT}
                title={t('menu.addRect')}
            >
                <FontAwesomeIcon icon={faSquare} />
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
)(MIRect);
