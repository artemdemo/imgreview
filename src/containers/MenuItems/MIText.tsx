import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { setShapeToAdd } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {
  disabled?: boolean;
};

export const MIText: React.FC<Props> = (props) => {
  const { disabled } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.TEXT,
      options: {
        fillColor: menu.strokeColor,
        fontSize: menu.fontSize,
      },
    });

    dispatch(setShapeToAdd(canvasApi.EShapeTypes.TEXT));

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
