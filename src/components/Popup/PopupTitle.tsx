import React from 'react';
import { ClearButton } from '../Button/ClearButton';
import s from './PopupTitle.module.css';

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
          className={s.PopupTitleClose}
        >
          ×
        </ClearButton>
      );
    }
    return <span>&nbsp;</span>;
  };

  const titleContent = () => {
    if (title.length > 0) {
      return <div className={s.PopupTitleText}>{title}</div>;
    }
    return <span>&nbsp;</span>;
  };

  return (
    <div className={s.PopupTitle}>
      <div className={s.PopupTitleSection}>{titleContent()}</div>
      <div className={s.PopupTitleSection}>{closeBtn()}</div>
    </div>
  );
};
