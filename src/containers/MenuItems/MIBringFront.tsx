import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';
import { ChangeOrderActions } from '../../../srcCanvas/api/api-types';

type Props = {
  disabled?: boolean;
};

export const MIBringFront: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi?.changeOrderOfActiveShape(ChangeOrderActions.BringToFront);
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.BringFront,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      title={t('menu.bringFront')}
    >
      <ImgIcon icon={EIcon.bringToFront} />
    </TopMenuItem>
  );
};
