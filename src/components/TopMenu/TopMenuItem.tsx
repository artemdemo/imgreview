import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import SubMenu, { TSubmenuData } from './SubMenu';
import MenuButton, {LinkProps} from './MenuButton';
import './TopMenuItem.less';
import classnames from 'classnames';

type Props = {
  subMenu?: TSubmenuData;
  disabled?: boolean;
  active?: boolean;
  open?: boolean;
  link?: LinkProps;
  title?: string;
  onClick?: (e?: any) => void;
  stopPropagation?: boolean;
};

export const TopMenuItem: React.FC<Props> = (props) => {
  const {
    subMenu = [],
    disabled,
    active,
    link,
    open = false,
    title = '',
    onClick,
    stopPropagation = true,
    children,
  } = props;

  const hasSubmenu = () => {
    return subMenu!.length > 0;
  };

  const handleClick = (e: any) => {
    if (stopPropagation) {
      // Parent <Menu> has functionality to blur shapes.
      // You should stop propagation, if you don't want <Menu> to blur shapes.
      // For example, selected shape should stay selected in order to continue to change width, color, etc.
      e.stopPropagation();
    }
    onClick && onClick(e);
  };

  return (
    <MenuButton
      disabled={disabled}
      active={active}
      onClick={handleClick}
      link={link}
      title={title}
      posRelative={hasSubmenu()}
    >
      <span className="TopMenuItem__Content">{children}</span>
      {hasSubmenu() ? (
        <>
          <span className="TopMenuItem__Caret">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
          <div
            className={classnames({
              TopMenuItem__Submenu: true,
              TopMenuItem__Submenu_open: open,
            })}
          >
            <SubMenu data={subMenu} />
          </div>
        </>
      ) : null}
    </MenuButton>
  );
};
