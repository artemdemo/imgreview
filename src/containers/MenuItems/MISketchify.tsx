import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { t } from '../../services/i18n';
import * as gaService from '../../services/ganalytics';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {
  reverse?: boolean;
  disabled?: boolean;
};

export const MISketchify: React.FC<Props> = (props) => {
  const { disabled = false, reverse = false } = props;
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  const onClick = () => {
    canvasApi?.sketchifyActiveShape();

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
