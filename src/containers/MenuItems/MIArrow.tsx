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

export const MIArrow: React.FC<Props> = (props) => {
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
      type: EShapeTypes.ARROW,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    dispatch(setShapeToAdd(EShapeTypes.ARROW));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddArrow,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === EShapeTypes.ARROW}
      title={t('menu.addArrow')}
    >
      <ImgIcon icon={EIcon.arrow} />
    </TopMenuItem>
  );
};
