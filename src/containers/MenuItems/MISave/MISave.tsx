/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React, { useContext, useState } from 'react';
import { TopMenuItem } from '../../../components/TopMenu/TopMenuItem';
import * as gaService from '../../../services/ganalytics';
import { t } from '../../../services/i18n';
import { MISavePopup } from './MISavePopup';
import { EIcon, ImgIcon } from '../../../components/ImgIcon/ImgIcon';
import { AppStateContext } from '../../../model/AppStateContext';

type Props = {
  disabled?: boolean;
};

export const MISave: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const [showPopup, setShowPopup] = useState(false);
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  const onClick = () => {
    setShowPopup(true);
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.SaveImage,
    });
  };

  const onPopupClose = () => {
    setShowPopup(false);
  };

  const onSubmit = (name: string) => {
    if (name !== '') {
      canvasApi?.exportCanvasToImage(name.trim());
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
        <ImgIcon icon={EIcon.save} />
      </TopMenuItem>
      <MISavePopup
        onSubmit={onSubmit}
        onCancel={onPopupClose}
        show={showPopup}
      />
    </>
  );
};
