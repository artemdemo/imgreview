import React, { useContext, useRef, useCallback } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import classnames from 'classnames';
import { hideColorPicker } from '../../model/menu/menuActions';
import { colorToStr, convertStrToRgba } from '../../services/color';
import { AppStateContext } from '../../model/AppStateContext';
import s from './ColorSelector.module.css';
import { useClickOutside } from '../../hooks/useClickOutside';

type Props = {
  onChange: (color: string) => void;
};

const ColorSelector: React.FC<Props> = (props) => {
  const { onChange } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);
  const baseRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    baseRef,
    useCallback(() => {
      // Color picker should be hidden only after he was shown :)
      // Besides this obvious reason - in any other case I just will make two actions to race:
      // Who will act first: show color picker or hide it
      if (menu.showColorPicker) {
        dispatch(hideColorPicker());
      }
    }, [menu]),
  );

  return (
    <div
      onClick={(e) => {
        // ColorSelector could be placed somewhere in the Menu container.
        // In this case I don't want click events to bubble up.
        e.stopPropagation();
      }}
      className={classnames({
        [s.ColorSelector]: true,
        [s.ColorSelector_show]: menu.showColorPicker,
      })}
      style={{
        top: menu.menuHeight,
      }}
      ref={baseRef}
    >
      <ChromePicker
        onChange={(color: ColorResult) => {
          onChange(colorToStr(color));
        }}
        color={convertStrToRgba(menu.strokeColor)}
      />
    </div>
  );
};

export default ColorSelector;
