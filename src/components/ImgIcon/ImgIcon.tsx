import React, { useEffect, useRef } from 'react';
import './ImgIcon.less';
import img from './images/imgreview-menu-icons-20.png';

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

  useEffect(() => {
    // Enum in TS has keys for key and value.
    // Meaning there are exactly 2 times more keys than actually are.
    const iconsAmount = Object.keys(EIcon).length / 2;

    wrapperEl.current?.style.setProperty('--img-icon-width', `${getCurrentIconWidth()}px`);
    wrapperEl.current?.style.setProperty('--img-icon-height', `${ICON_SIZE}px`);
    wrapperEl.current?.style.setProperty(
      '--img-icon-collection-width',
      `${ICON_SIZE * iconsAmount}px`,
    );
  }, []);

  const iconIdx = Number(icon);

  return (
    <span className="ImgIconWrapper" ref={wrapperEl}>
      <span
        className="ImgIcon"
        style={{
          backgroundImage: `url('${img}')`,
          left: getCurrentIconLeft(),
        }}
      />
    </span>
  );
};
