import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import s from './Tips.module.css';
import * as gaService from '../../services/ganalytics';
import { getQueryString } from '../../services/url';

export const Tips: React.FC = () => {
  const { query } = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(getQueryString(query));
  }, [query]);

  return (
    <div className={s.Tips}>
      Psst...
      <br />
      You can add as many images as you want.
      <br />
      To read more about this feature&nbsp;
      <Link href={`/features${search}`} passHref>
        <a
          onClick={() => {
            gaService.sendEvent({
              eventCategory: gaService.EEventCategories.Content,
              eventAction: gaService.EEventActions.FeaturesPage,
            });
          }}
        >
          click here
        </a>
      </Link>
      <br />
    </div>
  );
};
