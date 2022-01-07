import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../model/AppStateContext';
import { showNotification } from '../../model/notifications/notificationsActions';

type Props = {
  disabled?: boolean;
};

export const MICopyAll: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const { dispatch } = useContext(AppStateContext);

  const onClick = () => {
    // Blur event will take some time to affect shapes,
    // therefore I'm waiting for the next available timeFrame.
    requestAnimationFrame(() => {
      canvasApi.copyAllToClipboard();
      dispatch(showNotification({ message: t('all-copied') }));
    });

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.CopyAll,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      stopPropagation={false}
      title={t('menu.copyAll')}
    >
      <ImgIcon icon={EIcon.copy} />
    </TopMenuItem>
  );
};
