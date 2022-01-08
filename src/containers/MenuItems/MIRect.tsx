import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { setShapeToAdd } from '../../model/menu/menuActions';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';

type Props = {
  disabled?: boolean;
};

export const MIRect: React.FC<Props> = (props) => {
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
      type: EShapeTypes.RECT,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    dispatch(setShapeToAdd(EShapeTypes.RECT));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddRect,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === EShapeTypes.RECT}
      title={t('menu.addRect')}
    >
      <ImgIcon icon={EIcon.rectangle} />
    </TopMenuItem>
  );
};
