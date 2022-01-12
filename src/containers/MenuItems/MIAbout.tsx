import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';

export const MIAbout: React.FC = () => {
  return (
    <TopMenuItem
      link={{ href: '/about' }}
      onClick={() => {
        gaService.sendEvent({
          eventCategory: gaService.EEventCategories.MenuClick,
          eventAction: gaService.EEventActions.AboutPage,
        });
      }}
    >
      {t('menu.about')}
    </TopMenuItem>
  );
};
