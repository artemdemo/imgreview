import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import _ from 'lodash';
import { TReduxState } from '../../reducers';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import {
  setStrokeWidth,
  TSetStrokeWidth,
  toggleSubmenu,
  TToggleSubmenu,
} from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';
import * as canvasApi from '../../../srcCanvas/api';
import IShape from '../../../srcCanvas/Shape/IShape';
import store from '../../store';

const handleDragStarted = (shape: IShape) => {
  if (_.isFunction(shape.getStrokeWidth)) {
    store.dispatch(setStrokeWidth(shape.getStrokeWidth()));
  }
};

canvasApi.shapeClicked.on(handleDragStarted);
canvasApi.shapeDragStarted.on(handleDragStarted);

const STROKE_WIDTH = 'STROKE_WIDTH';

type TProps = {
  menu: TStateMenu;
  setStrokeWidth: TSetStrokeWidth;
  toggleSubmenu: TToggleSubmenu;
  disabled: boolean;
  show: boolean;
};

class MIStrokeWidth extends React.PureComponent<TProps> {
  static readonly defaultProps = {
    disabled: false,
    show: false,
  };

  createSubmenuItem = (value: number) => {
    const { menu } = this.props;
    return {
      text: `${value}px`,
      value,
      selected: menu.strokeWidth === value,
      onClick: this.handleSubMenuClick,
    };
  };

  handleMenuClick = () => {
    const { toggleSubmenu, menu } = this.props;
    toggleSubmenu(menu.openSubmenu === '' ? STROKE_WIDTH : '');
  };

  handleSubMenuClick = (item: any) => {
    const { setStrokeWidth } = this.props;
    setStrokeWidth(item.value);
    api.setStrokeWidthToActiveShape(item.value);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeStrokeWidth,
    });
  };

  handleClickOutside = () => {
    const { toggleSubmenu, menu } = this.props;

    if (menu.openSubmenu === STROKE_WIDTH) {
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
    const values = [2, 3, 5, 6, 7, 8, 10];
    return (
      <TopMenuItem
        subMenu={values.map(this.createSubmenuItem)}
        open={menu.openSubmenu === STROKE_WIDTH}
        disabled={disabled}
        show={show}
        onClick={this.handleMenuClick}
      >
        <ImgIcon icon={EIcon.strokeWidth} />
      </TopMenuItem>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    menu: state.menu,
  }),
  {
    setStrokeWidth,
    toggleSubmenu,
  }
)(onClickOutside(MIStrokeWidth));
