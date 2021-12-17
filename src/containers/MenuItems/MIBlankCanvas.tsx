import React from 'react';
import { useDispatch } from 'react-redux';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { updateCanvasSize } from '../../model/canvas/canvasActions';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type Props = {};

export const MIBlankCanvas: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const onClick = () => {
    const config = {
      width: 800,
      height: 500,
    };
    canvasApi.initBlankCanvas(config);
    dispatch(updateCanvasSize(config));
  };

  return (
    <TopMenuItem onClick={onClick} stopPropagation={false}>
      {t('menu.blank')}
    </TopMenuItem>
  );
};
