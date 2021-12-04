import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { setShapeToAdd, TSetShapeToAdd } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';

type TProps = {
  disabled: boolean;
  menu: TStateMenu;
  setShapeToAdd: TSetShapeToAdd;
};

class MIEllipse extends React.PureComponent<TProps> {
  static readonly defaultProps = {
    disabled: false,
  };

  onClick = () => {
    const { menu, setShapeToAdd } = this.props;
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.ELLIPSE,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    setShapeToAdd(canvasApi.EShapeTypes.ELLIPSE);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddEllipse,
    });
  };

  render() {
    const { disabled, menu } = this.props;
    return (
      <TopMenuItem
        onClick={this.onClick}
        disabled={disabled}
        active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.ELLIPSE}
        title={t('menu.addEllipse')}
      >
        <FontAwesomeIcon icon={faCircle} />
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
)(MIEllipse);
