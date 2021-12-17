import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import { TReduxState } from '../../reducers';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import {
  setFontSize,
  TSetStrokeWidth,
  toggleSubmenu,
  TToggleSubmenu,
} from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

const FONT_SIZE = 'FONT_SIZE';

type Props = {
  menu: TStateMenu;
  setFontSize: TSetStrokeWidth;
  toggleSubmenu: TToggleSubmenu;
  disabled?: boolean;
  show?: boolean;
};

class MIFontSize extends React.PureComponent<Props> {
  static readonly defaultProps = {
    disabled: false,
    show: false,
  };

  createSubmenuItem = (value: number) => {
    const { menu } = this.props;
    return {
      text: `${value}px`,
      value,
      selected: menu.fontSize === value,
      onClick: this.handleSubMenuClick,
    };
  };

  handleMenuClick = () => {
    const { toggleSubmenu, menu } = this.props;
    toggleSubmenu(menu.openSubmenu === '' ? FONT_SIZE : '');
  };

  handleSubMenuClick = (item: any) => {
    const { setFontSize } = this.props;
    setFontSize(item.value);
    api.setFontSizeToActiveShape(item.value);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeFontSize,
      eventValue: item.value,
    });
  };

  handleClickOutside = () => {
    const { toggleSubmenu, menu } = this.props;

    if (menu.openSubmenu === FONT_SIZE) {
      // There is weird bug with events propagation,
      // if I'm not wrapping this events dispatching.
      // (User can't add Arrow shape to the scene)
      requestAnimationFrame(() => {
        toggleSubmenu('');
      });
    }
  };

  render() {
    const { menu, disabled, show } = this.props;
    const values = [12, 14, 16, 18, 20, 25];
    return (
      <TopMenuItem
        subMenu={values.map(this.createSubmenuItem)}
        open={menu.openSubmenu === FONT_SIZE}
        disabled={disabled}
        show={show}
        onClick={this.handleMenuClick}
      >
        <ImgIcon icon={EIcon.fontSize} />
      </TopMenuItem>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    menu: state.menu,
  }),
  {
    setFontSize,
    toggleSubmenu,
  }
)(onClickOutside(MIFontSize));
