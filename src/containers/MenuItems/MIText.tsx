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

const MIText: React.FC<Props> = (props) => {
  const { menu, setShapeToAdd, disabled } = props;

  const onClick = () => {
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.TEXT,
      options: {
        fillColor: menu.strokeColor,
        fontSize: menu.fontSize,
      },
    });

    setShapeToAdd(canvasApi.EShapeTypes.TEXT);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddText,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.TEXT}
      title={t('menu.addText')}
    >
      <ImgIcon icon={EIcon.text} />
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
)(MIText);
