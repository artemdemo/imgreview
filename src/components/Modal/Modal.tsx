import React, {TransitionEvent, useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import ModalClickOutside from './ModalClickOutside';

import './Modal.less';

type Props = {
  base?: Element;
  baseClass?: string;
  className?: string;
  hideClickOutside?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  show?: boolean;
};

const Modal: React.FC<Props> = (props) => {
  const { base, onClose, show, onOpen, hideClickOutside, children, baseClass, className } = props;

  const modalWrapEl = useRef<HTMLElement | null>(null);
  const modalBaseRef = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (base) {
      if (modalWrapEl.current) {
        base.removeChild(modalWrapEl.current);
      }
      modalWrapEl.current = document.createElement('div');
      base.appendChild(modalWrapEl.current);
    }
    setMounted(true);
    return () => {
      if (base && modalWrapEl.current) {
        base.removeChild(modalWrapEl.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      if (show) {
        setEntering(true);
        setTimeout(() => {
          setOpen(true);
        });
      } else {
        setLeaving(true);
      }
    }
  }, [show]);

  const handleTransitionEnd = (e: TransitionEvent) => {
    // `handleTransitionEnd` is catching transitionEnd events from all child nodes
    // I'm not interested in that
    if (e.target === modalBaseRef.current) {
      if (entering) {
        setEntering(false);
      }
      if (leaving) {
        setOpen(false);
        setLeaving(false);
      }
      if (open && onOpen) {
        onOpen();
      }
    }
  }

  const onClickOutside = () => {
    if (!entering && open) {
      onClose && onClose();
    }
  }

  const renderContent = () => {
    if (hideClickOutside) {
      return (
        <ModalClickOutside onClickOutside={onClickOutside}>
          {children}
        </ModalClickOutside>
      );
    }
    return children;
  }

  if (
    !_.isString(baseClass) ||
    baseClass.replace(/\s+/, ' ').split(' ').length > 1
  ) {
    throw new Error('baseClass may contain one class at most');
  }
  const modalClass = classnames(baseClass, className, {
    [`${baseClass}_entering`]: entering,
    [`${baseClass}_open`]: open,
    [`${baseClass}_leaving`]: leaving,
  });
  const modal = (
    <div
      className={modalClass}
      onTransitionEnd={handleTransitionEnd}
      ref={modalBaseRef}
    >
      {renderContent()}
    </div>
  );
  if (base && modalWrapEl.current) {
    return createPortal(modal, modalWrapEl.current);
  }
  return modal;
};

export default Modal;
