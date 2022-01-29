import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';
import { getQueryString } from '../../services/url';

export const MIFeatures: React.FC = () => {
  const { query } = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(getQueryString(query));
  }, [query]);

  return (
    <TopMenuItem
      link={{ href: `/features${search}` }}
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
