import React, { useState } from 'react';
import { TopMenuItem } from '../../../components/TopMenu/TopMenuItem';
import MIResizePopup from './MIResizePopup';
import { t } from '../../../services/i18n';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MIResize: React.FC<Props> = (props) => {
  const { disabled } = props;
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit = (values: { width: string; height: string }) => {
    console.error(
      `This API is no longer supported, since canvas is nov infinite.\nI can't resize infinite canvas.`,
    );
    // const width = Number(values.width);
    // const height = Number(values.height);
    // if (width > 0 && height > 0) {
    //   setWidth(0);
    //   setHeight(0);
    //   setShowPopup(false);
    //   canvasApi.updateCanvasSize({ width, height });
    // }
  };

  return (
    <>
      <TopMenuItem
        onClick={() => {
          setShowPopup(true);
        }}
        disabled={disabled}
        title={t('menu.resize')}
        stopPropagation={false}
      >
        <ImgIcon icon={EIcon.resize} />
      </TopMenuItem>
      <MIResizePopup
        widthInit={0}
        heightInit={0}
        onSubmit={onSubmit}
        onCancel={() => {
          setShowPopup(false);
        }}
        show={showPopup}
      />
    </>
  );
};
