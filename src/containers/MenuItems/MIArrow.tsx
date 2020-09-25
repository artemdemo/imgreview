import React from 'react';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLongArrowAltUp} from '@fortawesome/free-solid-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';
import {setShapeToAdd, TSetShapeToAdd} from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
    setShapeToAdd: TSetShapeToAdd;
};

type TState = {
    active: boolean;
};

class MIArrow extends React.PureComponent<TProps, TState> {
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
        const { menu, setShapeToAdd } = this.props;
        canvasApi.startAddingShape({
            type: canvasApi.EShapeTypes.ARROW,
            options: {
                strokeColor: menu.strokeColor,
                strokeWidth: menu.strokeWidth,
            },
        });

        setShapeToAdd(canvasApi.EShapeTypes.ARROW);

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.AddArrow,
        });
    };

    render() {
        const { disabled, menu } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.ARROW}
                title={t('menu.addArrow')}
            >
                <FontAwesomeIcon icon={faLongArrowAltUp} rotation={270} />
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
)(MIArrow);
