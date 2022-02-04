import React, {
  useContext,
  useEffect,
  forwardRef,
  MutableRefObject,
  useState,
} from 'react';
import _ from 'lodash';
import { SubMenu, TSubmenuData } from './SubMenu';
import MenuButton, { LinkProps } from './MenuButton';
import classnames from 'classnames';
import { EIcon, ImgIcon } from '../ImgIcon/ImgIcon';
import { toggleSubmenu } from '../../model/menu/menuActions';
import { AppStateContext } from '../../model/AppStateContext';
import { MenuTooltip } from './MenuTooltip';
import s from './TopMenuItem.module.css';

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
    children,
  } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const [mountTooltip, setMountTooltip] = useState<boolean>(false);
  const [buttonEl, setButtonEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountTooltip(true);
    const closeMenu = () => {
      // I'm resetting it here, in order to fix a bug.
      // Without it if you open the menu (font size, or line width)
      // and then click on stage (so shape will lose focus)
      // and click on this shape again - menu will appear and will be still open.
      dispatch(toggleSubmenu(''));
    };
    let unsubShapesBlurred = _.noop;
    let unsubShapeClicked = _.noop;
    if (canvasApi) {
      unsubShapesBlurred = canvasApi.onShapeBlurred(closeMenu);
      unsubShapeClicked = canvasApi.onShapeClicked(closeMenu);
    }
    return () => {
      unsubShapesBlurred();
      unsubShapeClicked();
    };
  }, []);

  const hasSubmenu = () => {
    return subMenu && subMenu.items.length > 0;
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

  if (React.Children.count(children) === 1) {
    const child = React.Children.toArray(children)[0];
    // @ts-ignore
    if (child?.type?.displayName) {
      return (
        <>
          <div
            className={s.TopMenuItem}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className={s.TopMenuItem__Content}>{children}</span>
          </div>
          <MenuButton
            disabled={disabled}
            active={active}
            onClick={handleClick}
            link={link}
            title={title}
            posRelative={hasSubmenu()}
            ref={handleRef}
          >
            {hasSubmenu() ? (
              <>
                <ImgIcon icon={EIcon.chevronDown} />
                <div
                  className={classnames({
                    [s.TopMenuItem__Submenu]: true,
                    [s.TopMenuItem__Submenu_open]:
                      menu.openSubmenu === subMenu?.token,
                  })}
                >
                  <SubMenu data={subMenu!.items} />
                </div>
              </>
            ) : null}
          </MenuButton>
        </>
      );
    }
  }

  return (
    <>
      <MenuButton
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
                [s.TopMenuItem__Submenu_open]:
                  menu.openSubmenu === subMenu?.token,
              })}
            >
              <SubMenu data={subMenu!.items} />
            </div>
          </>
        ) : null}
      </MenuButton>
      {mountTooltip && title !== '' && (
        <MenuTooltip buttonEl={buttonEl}>{title}</MenuTooltip>
      )}
    </>
  );
});

TopMenuItem.displayName = 'TopMenuItem';
