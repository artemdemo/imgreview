import React, {useMemo, useRef} from 'react';
import img from './assets/imgreview-menu-icons-20.png';
import { StyleProperties } from '../StyleProperties/StyleProperties';
import s from './ImgIcon.module.css';

export enum EIcon {
  load,
  save,
  copy,
  arrow,
  text,
  rectangle,
  circle,
  rectSelect,
  resize,
  strokeWidth,
  fontSize,
  check,
  zoom,
  info,
  undo,
  redo,
  sendToBack,
  bringToFront,
  chevronDown,
}

type Props = {
  icon: EIcon;
};

const ICON_SIZE = 20;

export const ImgIcon: React.FC<Props> = (props) => {
  const { icon } = props;
  const wrapperEl = useRef<HTMLSpanElement>(null);

  const getCurrentIconWidth = () => {
    if (icon === EIcon.chevronDown) {
      return 10;
    }
    return ICON_SIZE;
  };

  const getCurrentIconLeft = () => {
    if (icon === EIcon.chevronDown) {
      return -1 * Number(icon) * ICON_SIZE - 7;
    }
    return -1 * Number(icon) * ICON_SIZE;
  };

  // Enum in TS has keys for key and value.
  // Meaning there are exactly 2 times more keys than actually are.
  const iconsAmount = Object.keys(EIcon).length / 2;

  return (
    <StyleProperties
      properties={useMemo(() => ({
        '--img-icon-width': `${getCurrentIconWidth()}px`,
        '--img-icon-height': `${ICON_SIZE}px`,
        '--img-icon-collection-width': `${ICON_SIZE * iconsAmount}px`,
      }), [icon])}
    >
      <span className={s.ImgIconWrapper} ref={wrapperEl}>
        <span
          className={s.ImgIcon}
          style={useMemo(() => ({
            backgroundImage: `url('${img}')`,
            left: getCurrentIconLeft(),
          }), [icon])}
        />
      </span>
    </StyleProperties>
  );
};
