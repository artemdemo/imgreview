import React, { ReactElement } from 'react';
import Modal from '../Modal/Modal';
import { ButtonProp, PopupButtons } from './PopupButtons';
import './Popup.less';
import { PopupTitle } from './PopupTitle';

type Props = {
  onClose?: () => void;
  onOpen?: () => void;
  title?: string;
  showCloseBtn: boolean;
  contentIcon?: ReactElement;
  base?: Element;
  className?: string;
  hideClickOutside?: boolean;
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
    hideClickOutside,
    title,
    show,
    children,
  } = props;

  const renderContent = () => {
    if (contentIcon) {
      return (
        <div className="popup-content">
          <div className="popup-content__icon">{contentIcon}</div>
          <div className="popup-content__text">{children}</div>
        </div>
      );
    }
    return children;
  };

  return (
    <>
      <Modal
        baseClass="popup-bg"
        show={show}
        hideClickOutside={false}
        base={base}
      >
        <div />
      </Modal>
      <Modal
        className={className}
        baseClass="popup"
        show={show}
        hideClickOutside={hideClickOutside}
        onClose={onClose}
        onOpen={onOpen}
        base={base}
      >
        <div>
          {!!title && (
            <PopupTitle title={title} onClose={onClose} showCloseBtn />
          )}
          <div className="popup-body">
            {renderContent()}
            {!!buttons && <PopupButtons buttons={buttons} />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Popup;
