import React, { useEffect, useState } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';
import { useRouter } from 'next/router';
import { getQueryString } from '../../services/url';

export const MIAbout: React.FC = () => {
  const { query } = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(getQueryString(query));
  }, [query]);

  return (
    <TopMenuItem
      link={{ href: `/about${search}` }}
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
