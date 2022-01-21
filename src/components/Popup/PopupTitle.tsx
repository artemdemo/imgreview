import React from 'react';
import { ClearButton } from '../Button/ClearButton';
import './PopupTitle.css';

type Props = {
  title: string;
  showCloseBtn?: boolean;
  onClose?: () => void;
};

export const PopupTitle: React.FC<Props> = (props) => {
  const { title, showCloseBtn, onClose } = props;

  const closeBtn = () => {
    if (showCloseBtn) {
      return (
        <ClearButton
          onClick={onClose}
          type="button"
          className="popup-title-close"
        >
          ×
        </ClearButton>
      );
    }
    return <span>&nbsp;</span>;
  };

  const titleContent = () => {
    if (title.length > 0) {
      return <div className="popup-title-text">{title}</div>;
    }
    return <span>&nbsp;</span>;
  };

  return (
    <div className="popup-title">
      <div className="popup-title-section">{titleContent()}</div>
      <div className="popup-title-section">{closeBtn()}</div>
    </div>
  );
};
