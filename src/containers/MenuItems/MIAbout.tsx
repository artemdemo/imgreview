import React from 'react';
import { Link } from 'react-router-dom';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';

export const MIAbout: React.FC = () => {
  return (
    <TopMenuItem>
      <Link to="/about">{t('menu.about')}</Link>
    </TopMenuItem>
  );
};
