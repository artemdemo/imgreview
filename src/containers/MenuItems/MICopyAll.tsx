import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MICopyAll: React.FC<Props> = (props) => {
  const { disabled = false } = props;

  const onClick = () => {
    // Blur event will take some time to affect shapes,
    // therefore I'm waiting for the next available timeFrame.
    requestAnimationFrame(() => {
      canvasApi.copyAllToClipboard();
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
