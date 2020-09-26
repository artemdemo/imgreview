import React from 'react';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSquare} from '@fortawesome/free-regular-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import RoughIconWrapper from '../../components/Icons/RoughIconWrapper';

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
};

type TState = {
    active: boolean;
};

class MIRectRough extends React.PureComponent<TProps, TState> {
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
                <RoughIconWrapper>
                    <FontAwesomeIcon icon={faSquare} />
                </RoughIconWrapper>
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    })
)(MIRectRough);
