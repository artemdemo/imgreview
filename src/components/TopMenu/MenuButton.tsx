import React, { forwardRef } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import sMenuButton from './MenuButton.module.css';
import sTopMenuItem from './TopMenuItem.module.css';

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
  children: any;
};

const MenuButton = forwardRef<any, Props>((props, ref) => {
  const {
    disabled = false,
    active = false,
    onClick,
    className,
    title,
    posRelative,
    link: { href = '' } = {},
  } = props;

  const classNameResult = classnames(
    className,
    sTopMenuItem.TopMenuItem,
    sMenuButton.MenuButton,
    {
      [sMenuButton.MenuButton_active]: active,
      [sMenuButton.MenuButton_posRelative]: posRelative,
      [sMenuButton.MenuButton_disabled]: disabled,
    },
  );

  if (href.length === 0) {
    return (
      <button
        className={classNameResult}
        onClick={onClick}
        title={title}
        disabled={disabled}
        ref={ref}
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
        ref={ref}
      >
        {props.children}
      </a>
    );
  }

  return (
    <Link href={href} passHref>
      <a className={classNameResult} onClick={onClick} title={title} ref={ref}>
        {props.children}
      </a>
    </Link>
  );
});

MenuButton.displayName = 'MenuButton';

export default MenuButton;
