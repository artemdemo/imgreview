import React, { useLayoutEffect, useState } from 'react';
import { useFloating, shift, offset } from '@floating-ui/react-dom';
import s from './MenuTooltip.module.css';

type Props = {
  buttonEl: HTMLElement | null;
};

export const MenuTooltip: React.FC<Props> = (props) => {
  const { children, buttonEl } = props;
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    middleware: [offset(5), shift()],
  });
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    const showTooltip = () => setShow(true);
    const hideTooltip = () => setShow(false);
    if (buttonEl) {
      reference(buttonEl);
      buttonEl.addEventListener('mouseenter', showTooltip);
      buttonEl.addEventListener('mouseleave', hideTooltip);
    }
    return () => {
      buttonEl?.removeEventListener('mouseenter', showTooltip);
      buttonEl?.removeEventListener('mouseleave', hideTooltip);
    };
  }, [buttonEl]);

  return (
    <div
      className={s.MenuTooltip}
      ref={floating}
      style={{
        position: strategy,
        visibility: show ? 'visible' : 'hidden',
        top: y ?? '',
        left: x ?? '',
      }}
    >
      {children}
    </div>
  );
};

MenuTooltip.displayName = 'MenuTooltip';
