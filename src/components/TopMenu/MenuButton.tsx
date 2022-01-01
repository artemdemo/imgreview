import React from 'react';
import './MenuButton.less';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

export type LinkProps = {
  href: string;
};

type Props = {
  disabled?: boolean;
  active?: boolean;
  className?: string;
  title?: string;
  posRelative?: boolean;
  onClick?: (e?: any) => void;
  link?: LinkProps;
};

const MenuButton: React.FC<Props> = (props) => {
  const {
    disabled = false,
    active = false,
    onClick,
    className,
    title,
    posRelative,
    link: { href = '' } = {},
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
        disabled={disabled}
        type="button"
      >
        {props.children}
      </button>
    );
  }

  if (href.startsWith('http')) {
    return (
      <a
        className={classNameResult}
        onClick={onClick}
        title={title}
        href={href}
      >
        {props.children}
      </a>
    );
  }

  return (
    <Link className={classNameResult} onClick={onClick} title={title} to={href}>
      {props.children}
    </Link>
  );
};

export default MenuButton;
