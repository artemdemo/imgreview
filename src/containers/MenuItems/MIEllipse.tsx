import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setShapeToAdd } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';

type Props = {
  disabled?: boolean;
};

export const MIEllipse: React.FC<Props> = (props) => {
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
      type: EShapeTypes.ELLIPSE,
      options: {
        strokeColor: menu.strokeColor,
        fillColor: menu.fillColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    dispatch(setShapeToAdd(EShapeTypes.ELLIPSE));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddEllipse,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === EShapeTypes.ELLIPSE}
      title={t('menu.addEllipse')}
    >
      <ImgIcon icon={EIcon.circle} />
    </TopMenuItem>
  );
};
