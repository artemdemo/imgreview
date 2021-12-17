import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';

type Props = {
  reverse?: boolean;
  disabled: boolean;
};

export const MISketchify: React.FC<Props> = (props) => {
  const { disabled, reverse = false } = props;

  const onClick = () => {
    canvasApi.sketchifyActiveShape();

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.Sketchify,
    });
  };

  const text = reverse ? t('menu.unsketchify') : t('menu.sketchify');
  return (
    <TopMenuItem onClick={onClick} title={text} disabled={disabled}>
      {text}
    </TopMenuItem>
  );
};
