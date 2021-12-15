/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { TReduxState } from '../../../reducers';
import TopMenuItem from '../../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../../srcCanvas/api';
import * as gaService from '../../../services/ganalytics';
import { t } from '../../../services/i18n';
import { MISavePopup } from './MISavePopup';
import { TStateCanvas } from '../../../model/canvas/canvasReducer';

type Props = {
  disabled: boolean;
};

const MISave: React.FC<Props> = (props) => {
  const { disabled } = props;
  const [nameInit, setNameInit] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const canvas = useSelector<TReduxState, TStateCanvas>(
    (state) => state.canvas
  );

  const onClick = () => {
    setNameInit(canvas.imageOriginName);
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
        <FontAwesomeIcon icon={faDownload} />
      </TopMenuItem>
      <MISavePopup
        onSubmit={onSubmit}
        onCancel={onPopupClose}
        show={showPopup}
        nameInit={nameInit}
      />
    </>
  );
};

export default MISave;