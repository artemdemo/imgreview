import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { setShapeToAdd, TSetShapeToAdd } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
  menu: TStateMenu;
  setShapeToAdd: TSetShapeToAdd;
};

const MIArrow: React.FC<Props> = (props) => {
  const { menu, setShapeToAdd, disabled = false } = props;

  const onClick = () => {
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

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.ARROW}
      title={t('menu.addArrow')}
    >
      <ImgIcon icon={EIcon.arrow} />
    </TopMenuItem>
  );
};

export default connect(
  (state: TReduxState) => ({
    menu: state.menu,
  }),
  {
    setShapeToAdd,
  }
)(MIArrow);
