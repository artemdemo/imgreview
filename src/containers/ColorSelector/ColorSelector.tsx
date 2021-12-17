import React from 'react';
import { connect } from 'react-redux';
import { ChromePicker, ColorResult } from 'react-color';
import onClickOutside from 'react-click-outside';
import classnames from 'classnames';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import {
  THideColorPicker,
  hideColorPicker,
} from '../../model/menu/menuActions';
import './ColorSelector.less';

type Props = {
  menu: TStateMenu;
  // `onChangeStrokeColor` cb will be used by the parent if it needs to update something
  // For example send ga event
  onChangeStrokeColor: (color: ColorResult) => void;
  hideColorPicker: THideColorPicker;
};

class ColorSelector extends React.PureComponent<Props> {
  onChangeColor = (color: ColorResult) => {
    const { onChangeStrokeColor } = this.props;

    onChangeStrokeColor(color);
  };

  // ColorSelector could be placed somewhere in the Menu container.
  // In this case I don't want click events to bubble up.
  onClickWrapper = (e: any) => e.stopPropagation();

  handleClickOutside = () => {
    const { hideColorPicker, menu } = this.props;
    // Color picker should be hidden only after he was shown :)
    // Besides this obvious reason - in any other case I just will make two actions to race:
    // Who will act first: show color picker or hide it
    if (menu.showColorPicker) {
      hideColorPicker();
    }
  };

  render() {
    const { menu } = this.props;

    return (
      <div
        onClick={this.onClickWrapper}
        className={classnames({
          ColorSelector: true,
          ColorSelector_show: menu.showColorPicker,
        })}
        style={{
          top: menu.menuHeight,
        }}
      >
        <ChromePicker onChange={this.onChangeColor} color={menu.strokeColor} />
      </div>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    menu: state.menu,
  }),
  {
    hideColorPicker,
  }
)(onClickOutside(ColorSelector));
