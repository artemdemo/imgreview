import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';

export const MIFeatures: React.FC = () => {
  return (
    <TopMenuItem
      link={{ href: '/features' }}
      onClick={() => {
        gaService.sendEvent({
          eventCategory: gaService.EEventCategories.MenuClick,
          eventAction: gaService.EEventActions.FeaturesPage,
        });
      }}
    >
      {t('menu.features')}
    </TopMenuItem>
  );
};
