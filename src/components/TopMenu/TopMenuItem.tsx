import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import SubMenu, { TSubmenuData } from './SubMenu';
import MenuButton from './MenuButton';
import './TopMenuItem.less';
import classnames from 'classnames';

type Props = {
  subMenu?: TSubmenuData;
  show?: boolean;
  disabled?: boolean;
  active?: boolean;
  open?: boolean;
  href?: string;
  title?: string;
  onClick?: (e?: any) => void;
  stopPropagation?: boolean;
};

class TopMenuItem extends React.PureComponent<Props> {
  static readonly defaultProps = {
    onClick: null,
    show: true,
    disabled: false,
    open: false,
    href: '',
    title: '',
    subMenu: [],
    stopPropagation: true,
  };

  hasSubmenu() {
    const { subMenu } = this.props;
    return subMenu!.length > 0;
  }

  onClick = (e: any) => {
    const { onClick, stopPropagation } = this.props;
    if (stopPropagation) {
      // Parent <Menu> has functionality to blur shapes.
      // You should stop propagation, if you don't want <Menu> to blur shapes.
      // For example, selected shape should stay selected in order to continue to change width, color, etc.
      e.stopPropagation();
    }
    onClick && onClick(e);
  };

  render() {
    const { disabled, show, active, href, title, subMenu, open } = this.props;
    if (show) {
      return (
        <MenuButton
          disabled={disabled}
          active={active}
          onClick={this.onClick}
          href={href}
          title={title}
          posRelative={this.hasSubmenu()}
        >
          <span className="TopMenuItem__Content">{this.props.children}</span>
          {this.hasSubmenu() ? (
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
    }
    return null;
  }
}

export default TopMenuItem;
