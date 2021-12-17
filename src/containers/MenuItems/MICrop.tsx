import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
  show?: boolean;
};

export const MICrop: React.FC<Props> = (props) => {
  const { disabled, show } = props;

  const onClick = () => {
    canvasApi.cropSelected();

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ApplyCrop,
    });
  };

  return (
    <TopMenuItem onClick={onClick} disabled={disabled} show={show}>
      <ImgIcon icon={EIcon.crop} />
    </TopMenuItem>
  );
};
