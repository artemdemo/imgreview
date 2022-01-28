import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as gaService from '../../services/ganalytics';

export const MImgReview: React.FC = () => {
  return (
    <TopMenuItem
      link={{ href: '/' }}
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