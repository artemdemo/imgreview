import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';

export const MIGithub: React.FC = () => {
  return (
    <TopMenuItem
      link={{ href: 'https://github.com/artemdemo/imgreview' }}
      onClick={() => {
        gaService.sendEvent({
          eventCategory: gaService.EEventCategories.MenuClick,
          eventAction: gaService.EEventActions.GithubPage,
        });
      }}
    >
      Github
    </TopMenuItem>
  );
};
