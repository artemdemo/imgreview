import React, {
  useContext,
  useEffect,
  forwardRef,
  MutableRefObject,
  useState,
} from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { SubMenu, TSubmenuData } from './SubMenu';
import MenuButton, { LinkProps } from './MenuButton';
import classnames from 'classnames';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';
import { toggleSubmenu } from '../../model/menu/menuActions';
import { AppStateContext } from '../../model/AppStateContext';
import s from './TopMenuItem.module.css';

const MenuTooltip = dynamic(
  () =>
    import(
      /* webpackChunkName: "MenuTooltip" */
      './MenuTooltip'
    ),
  { ssr: false },
);

type Props = {
  subMenu?: {
    items: TSubmenuData;
    token: string;
  };
  disabled?: boolean;
  active?: boolean;
  link?: LinkProps;
  title?: string;
  onClick?: (e?: any) => void;
  stopPropagation?: boolean;
  satellite?: React.ReactElement;
  children: any;
};

export const TopMenuItem = forwardRef<HTMLElement, Props>((props, ref) => {
  const {
    subMenu,
    disabled,
    active,
    link,
    title = '',
    onClick = _.noop,
    stopPropagation = true,
    satellite,
    children,
  } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);
  // MenuTooltip is using `useLayoutEffect()`, which throws an Error in SSR.
  // This is a way to make it work - render MenuTooltip only after mount.
  const [mountTooltip, setMountTooltip] = useState<boolean>(false);
  const [buttonEl, setButtonEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountTooltip(true);
  }, []);

  const hasSubmenu = () => {
    return subMenu && subMenu.items.length > 0;
  };

  const isSubmenuOpen = () => {
    return menu.openSubmenu === subMenu?.token;
  };

  const handleClick = (e: any) => {
    if (stopPropagation) {
      // Parent <Menu> has functionality to blur shapes.
      // You should stop propagation, if you don't want <Menu> to blur shapes.
      // For example, selected shape should stay selected in order to continue to change width, color, etc.
      e.stopPropagation();
    }
    if (hasSubmenu()) {
      dispatch(toggleSubmenu(menu.openSubmenu === '' ? subMenu!.token : ''));
    }
    onClick(e);
  };

  const handleRef = (refEl: HTMLElement) => {
    if (_.isFunction(ref)) {
      ref(refEl);
    } else if (ref) {
      (ref as MutableRefObject<HTMLElement>).current = refEl;
    }
    setButtonEl(refEl);
  };

  return (
    <div className={s.TopMenuItemWrapper}>
      <MenuButton
        className={s.TopMenuItem}
        disabled={disabled}
        active={active}
        onClick={handleClick}
        link={link}
        posRelative={hasSubmenu()}
        ref={handleRef}
      >
        <span className={s.TopMenuItem__Content}>{children}</span>
        {hasSubmenu() ? (
          <>
            <span className={s.TopMenuItem__Caret}>
              <ImgIcon icon={EIcon.chevronDown} />
            </span>
            <div
              className={classnames({
                [s.TopMenuItem__Submenu]: true,
                [s.TopMenuItem__Submenu_open]: isSubmenuOpen(),
              })}
            >
              <SubMenu data={subMenu!.items} />
            </div>
          </>
        ) : null}
      </MenuButton>
      {mountTooltip && title !== '' && !isSubmenuOpen() && (
        <MenuTooltip buttonEl={buttonEl}>{title}</MenuTooltip>
      )}
      {satellite}
    </div>
  );
});

TopMenuItem.displayName = 'TopMenuItem';
