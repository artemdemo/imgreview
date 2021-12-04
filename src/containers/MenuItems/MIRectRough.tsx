import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import RoughIconWrapper from '../../components/Icons/RoughIconWrapper';
import { setShapeToAdd, TSetShapeToAdd } from '../../model/menu/menuActions';

type TProps = {
  disabled: boolean;
  menu: TStateMenu;
  setShapeToAdd: TSetShapeToAdd;
};

class MIRectRough extends React.PureComponent<TProps> {
  static readonly defaultProps = {
    disabled: false,
  };

  onClick = () => {
    const { menu, setShapeToAdd } = this.props;
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.RECT_ROUGH,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    setShapeToAdd(canvasApi.EShapeTypes.RECT_ROUGH);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddRectRough,
    });
  };

  render() {
    const { disabled, menu } = this.props;
    return (
      <TopMenuItem
        onClick={this.onClick}
        disabled={disabled}
        active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.RECT_ROUGH}
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
  }),
  {
    setShapeToAdd,
  }
)(MIRectRough);
