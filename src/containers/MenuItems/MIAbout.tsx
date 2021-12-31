import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';

export const MIAbout: React.FC = () => {
  return (
    <TopMenuItem link={{ href: '/about' }}>
      {t('menu.about')}
    </TopMenuItem>
  );
};
