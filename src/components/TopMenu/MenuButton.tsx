import React from 'react';
import './MenuButton.less';
import classnames from 'classnames';

type Props = {
  disabled?: boolean;
  href?: string;
  active?: boolean;
  className?: string;
  title?: string;
  posRelative?: boolean;
  onClick?: (e?: any) => void;
};

const MenuButton: React.FC<Props> = (props) => {
  const {
    disabled = false,
    active = false,
    onClick,
    className,
    title,
    posRelative,
    href = '',
  } = props;

  const classNameResult = classnames(className, 'MenuButton', {
    MenuButton_active: active,
    MenuButton_posRelative: posRelative,
    MenuButton_disabled: disabled,
  });

  if (href.length === 0) {
    return (
      <button
        className={classNameResult}
        onClick={onClick}
        title={title}
        type="button"
      >
        {props.children}
      </button>
    );
  }

  return (
    <a className={classNameResult} onClick={onClick} title={title} href={href}>
      {props.children}
    </a>
  );
};

export default MenuButton;
