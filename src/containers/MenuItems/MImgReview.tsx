import React, { useEffect, useState } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';
import { useRouter } from 'next/router';
import { getQueryString } from '../../services/query';

export const MImgReview: React.FC = () => {
  const { query } = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(getQueryString(query));
  }, [query]);

  return (
    <TopMenuItem
      link={{ href: `/${search}` }}
      onClick={() => {
        gaService.sendEvent({
          eventCategory: gaService.EEventCategories.MenuClick,
          eventAction: gaService.EEventActions.MainPage,
        });
      }}
    >
      ImgReview
    </TopMenuItem>
  );
};
