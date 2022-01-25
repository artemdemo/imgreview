import React, { ReactElement } from 'react';
import Modal from '../Modal/Modal';
import { ButtonProp, PopupButtons } from './PopupButtons';
import { PopupTitle } from './PopupTitle';
import s from './Popup.module.css';

type Props = {
  onClose?: () => void;
  onOpen?: () => void;
  title?: string;
  showCloseBtn: boolean;
  contentIcon?: ReactElement;
  base?: Element;
  className?: string;
  show?: boolean;
  buttons?: ButtonProp | ButtonProp[];
};

const Popup: React.FC<Props> = (props) => {
  const {
    onClose,
    onOpen,
    contentIcon,
    base,
    className,
    buttons,
    title,
    show,
    children,
  } = props;

  const renderContent = () => {
    if (contentIcon) {
      return (
        <div className={s.PopupContent}>
          <div className={s.PopupContent__icon}>{contentIcon}</div>
          <div className={s.PopupContent__text}>{children}</div>
        </div>
      );
    }
    return children;
  };

  return (
    <>
      <Modal
        baseClasses={{
          base: s.PopupBg,
          entering: s.PopupBg_entering,
          open: s.PopupBg_open,
          leaving: s.PopupBg_leaving,
        }}
        show={show}
        base={base}
      >
        <div />
      </Modal>
      <Modal
        className={className}
        baseClasses={{
          base: s.Popup,
          entering: s.Popup_entering,
          open: s.Popup_open,
          leaving: s.Popup_leaving,
        }}
        show={show}
        onClose={onClose}
        onOpen={onOpen}
        base={base}
      >
        <div>
          {!!title && (
            <PopupTitle title={title} onClose={onClose} showCloseBtn />
          )}
          <div className={s.PopupBody}>
            {renderContent()}
            {!!buttons && <PopupButtons buttons={buttons} />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Popup;
