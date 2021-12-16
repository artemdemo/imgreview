import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { setShapeToAdd, TSetShapeToAdd } from '../../model/menu/menuActions';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
  menu: TStateMenu;
  setShapeToAdd: TSetShapeToAdd;
};

const MIRect: React.FC<Props> = (props) => {
  const { menu, setShapeToAdd, disabled = false } = props;

  const onClick = () => {
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

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.RECT}
      title={t('menu.addRect')}
    >
      <ImgIcon icon={EIcon.rectangle} />
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
)(MIRect);
