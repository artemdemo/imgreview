import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import {
  updateCanvasSize,
  TUpdateCanvasSize,
} from '../../model/canvas/canvasActions';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type Props = {
  updateCanvasSize: TUpdateCanvasSize;
  show?: boolean;
};

const MIBlankCanvas: React.FC<Props> = (props) => {
  const { updateCanvasSize, show = false } = props;

  const onClick = () => {
    const config = {
      width: 800,
      height: 500,
    };
    canvasApi.initBlankCanvas(config);
    updateCanvasSize(config);
  };

  return (
    <TopMenuItem onClick={onClick} show={show} stopPropagation={false}>
      {t('menu.blank')}
    </TopMenuItem>
  );
};

export default connect(() => ({}), {
  updateCanvasSize,
})(MIBlankCanvas);
