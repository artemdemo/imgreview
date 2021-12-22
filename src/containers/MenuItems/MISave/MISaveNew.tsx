/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React, { useState } from 'react';
import { TopMenuItem } from '../../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../../srcCanvas/api';
import * as gaService from '../../../services/ganalytics';
import { t } from '../../../services/i18n';
import { MISavePopup } from './MISavePopup';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';
import { exportCanvasToImageNew } from '../../../../srcCanvas/api';

type Props = {
  disabled?: boolean;
};

export const MISaveNew: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const [showPopup, setShowPopup] = useState(false);

  const onClick = () => {
    // setShowPopup(true);
    // gaService.sendEvent({
    //   eventCategory: gaService.EEventCategories.MenuClick,
    //   eventAction: gaService.EEventActions.SaveImage,
    // });
    canvasApi.exportCanvasToImageNew('aaa');
  };

  const onPopupClose = () => {
    setShowPopup(false);
  };

  const onSubmit = (name: string) => {
    if (name !== '') {
      canvasApi.exportCanvasToImage(name.trim());
      setShowPopup(false);
    }
  };

  return (
    <>
      <TopMenuItem
        onClick={onClick}
        title={t('menu.save')}
        disabled={disabled}
        stopPropagation={false}
      >
        SaveNew
      </TopMenuItem>
      <MISavePopup
        onSubmit={onSubmit}
        onCancel={onPopupClose}
        show={showPopup}
        nameInit={''}
      />
    </>
  );
};
