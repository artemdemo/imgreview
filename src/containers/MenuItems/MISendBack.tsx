import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {
  disabled?: boolean;
};

export const MISendBack: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const onClick = () => {
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.SendBack,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      title={t('menu.sendBack')}
    >
      <ImgIcon icon={EIcon.sendToBack} />
    </TopMenuItem>
  );
};
