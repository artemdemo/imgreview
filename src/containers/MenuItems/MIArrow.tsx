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

export const MIArrow: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.ARROW,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    dispatch(setShapeToAdd(canvasApi.EShapeTypes.ARROW));

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
