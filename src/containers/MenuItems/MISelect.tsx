import React from 'react';
import {connect} from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import {setShapeToAdd, TSetShapeToAdd} from '../../model/menu/menuActions';
import { t } from '../../services/i18n';
import {TReduxState} from '../../reducers';
import {TStateMenu} from '../../model/menu/menuReducer';
import IconSelect from '../../components/Icons/IconSelect';

type TProps = {
    disabled: boolean;
    menu: TStateMenu;
    setShapeToAdd: TSetShapeToAdd;
};

class MISelect extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
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
