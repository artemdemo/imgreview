import React from 'react';
import Link from 'next/link';
import s from './Tips.module.css';
import * as gaService from '../../services/ganalytics';

export const Tips: React.FC = () => {
  return (
    <div className={s.Tips}>
      Psst...
      <br />
      You can add as many images as you want.
      <br />
      To read more about this feature&nbsp;
      <Link href="/features" passHref>
        <a
          onClick={() => {
            gaService.sendEvent({
              eventCategory: gaService.EEventCategories.Other,
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
