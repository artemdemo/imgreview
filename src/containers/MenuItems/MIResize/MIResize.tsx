import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TStateCanvas } from '../../../model/canvas/canvasReducer';
import { TReduxState } from '../../../reducers';
import TopMenuItem from '../../../components/TopMenu/TopMenuItem';
import MIResizePopup from './MIResizePopup';
import * as canvasApi from '../../../../srcCanvas/api';
import { t } from '../../../services/i18n';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MIResize: React.FC<Props> = (props) => {
  const { disabled } = props;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const canvas = useSelector<TReduxState, TStateCanvas>(
    (state) => state.canvas
  );

  const onSubmit = (values: { width: string; height: string }) => {
    const width = Number(values.width);
    const height = Number(values.height);
    if (width > 0 && height > 0) {
      setWidth(0);
      setHeight(0);
      setShowPopup(false);
      canvasApi.updateCanvasSize({ width, height });
    }
  };

  return (
    <>
      <TopMenuItem
        onClick={() => {
          setWidth(canvas.width);
          setHeight(canvas.height);
          setShowPopup(true);
        }}
        disabled={disabled}
        title={t('menu.resize')}
        stopPropagation={false}
      >
        <ImgIcon icon={EIcon.resize} />
      </TopMenuItem>
      <MIResizePopup
        widthInit={width}
        heightInit={height}
        onSubmit={onSubmit}
        onCancel={() => {
          setShowPopup(false);
        }}
        show={showPopup}
      />
    </>
  );
};
