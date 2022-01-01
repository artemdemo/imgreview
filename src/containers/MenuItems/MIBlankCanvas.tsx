import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type Props = {};

export const MIBlankCanvas: React.FC<Props> = (props) => {
  const onClick = () => {
    const config = {
      width: 800,
      height: 500,
    };
    canvasApi.initBlankCanvas(config);
  };

  return (
    <TopMenuItem onClick={onClick} stopPropagation={false}>
      {t('menu.blank')}
    </TopMenuItem>
  );
};
