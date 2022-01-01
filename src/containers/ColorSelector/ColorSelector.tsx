import React, { useContext } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import classnames from 'classnames';
import { hideColorPicker } from '../../model/menu/menuActions';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';
import { colorToStr, convertStrToRgba } from '../../services/color';
import './ColorSelector.less';
import { AppStateContext } from '../../model/AppStateContext';

type Props = {
  onChange: (color: string) => void;
};

const ColorSelector: React.FC<Props> = (props) => {
  const { onChange } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);

  const handleClickOutside = () => {
    // Color picker should be hidden only after he was shown :)
    // Besides this obvious reason - in any other case I just will make two actions to race:
    // Who will act first: show color picker or hide it
    if (menu.showColorPicker) {
      dispatch(hideColorPicker());
    }
  };

  return (
    <ModalClickOutside onClickOutside={handleClickOutside}>
      <div
        onClick={(e) => {
          // ColorSelector could be placed somewhere in the Menu container.
          // In this case I don't want click events to bubble up.
          e.stopPropagation();
        }}
        className={classnames({
          ColorSelector: true,
          ColorSelector_show: menu.showColorPicker,
        })}
        style={{
          top: menu.menuHeight,
        }}
      >
        <ChromePicker
          onChange={(color: ColorResult) => {
            onChange(colorToStr(color));
          }}
          color={convertStrToRgba(menu.strokeColor)}
        />
      </div>
    </ModalClickOutside>
  );
};

export default ColorSelector;
