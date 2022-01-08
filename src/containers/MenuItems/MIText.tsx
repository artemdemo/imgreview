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

export const MIText: React.FC<Props> = (props) => {
  const { disabled } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi?.startAddingShape({
      type: EShapeTypes.TEXT,
      options: {
        fillColor: menu.strokeColor,
        fontSize: menu.fontSize,
      },
    });

    dispatch(setShapeToAdd(EShapeTypes.TEXT));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddText,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === EShapeTypes.TEXT}
      title={t('menu.addText')}
    >
      <ImgIcon icon={EIcon.text} />
    </TopMenuItem>
  );
};
