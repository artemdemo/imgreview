import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { setShapeToAdd } from '../../model/menu/menuActions';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';

type Props = {
  disabled?: boolean;
};

export const MISelect: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi?.startAddingShape({
      type: EShapeTypes.SELECT_RECT,
    });

    dispatch(setShapeToAdd(EShapeTypes.SELECT_RECT));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddSelectRect,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === EShapeTypes.SELECT_RECT}
      title={t('menu.select')}
    >
      <ImgIcon icon={EIcon.rectSelect} />
    </TopMenuItem>
  );
};
