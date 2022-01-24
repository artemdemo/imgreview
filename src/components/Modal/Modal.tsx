import React, { TransitionEvent, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import ModalClickOutside from './ModalClickOutside';
import { createElement } from '../../services/document';
import s from './Modal.module.css';

type Props = {
  base?: Element;
  baseClasses?: {
    base: string;
    entering: string;
    open: string;
    leaving: string;
  };
  className?: string;
  hideClickOutside?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  show?: boolean;
};

const Modal: React.FC<Props> = (props) => {
  const {
    base,
    onClose,
    show,
    onOpen,
    hideClickOutside,
    children,
    baseClasses,
    className,
  } = props;

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
      const divEl = createElement('div');
      if (divEl) {
        modalWrapEl.current = divEl;
        base.appendChild(modalWrapEl.current);
      }
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
  };

  const onClickOutside = () => {
    if (!entering && open) {
      onClose && onClose();
    }
  };

  const renderContent = () => {
    if (hideClickOutside) {
      return (
        <ModalClickOutside onClickOutside={onClickOutside}>
          {children}
        </ModalClickOutside>
      );
    }
    return children;
  };

  const modalClass = classnames(baseClasses?.base || s.modal, className, baseClasses ? {
    [baseClasses.entering]: entering,
    [baseClasses.open]: open,
    [baseClasses.leaving]: leaving,
  } : {
    [s.entering]: entering,
    [s.open]: open,
    [s.leaving]: leaving,
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
