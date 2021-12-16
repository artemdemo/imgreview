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
  crop,
  fontSize,
  check,
  zoom,
  info,
}

type Props = {
  icon: EIcon;
};

const ICON_SIZE = 20;

export const ImgIcon: React.FC<Props> = (props) => {
  const { icon } = props;
  const wrapperEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Enum in TS has keys for key and value.
    // Meaning there are exactly 2 times more keys than actually are.
    const iconsAmount = Object.keys(EIcon).length / 2;

    wrapperEl.current?.style.setProperty('--img-icon-size', `${ICON_SIZE}px`);
    wrapperEl.current?.style.setProperty(
      '--img-icon-collection-width',
      `${ICON_SIZE * iconsAmount}px`
    );
  }, []);

  return (
    <span className="ImgIconWrapper" ref={wrapperEl}>
      <span
        className="ImgIcon"
        style={{
          backgroundImage: `url('${img}')`,
          left: -1 * Number(icon) * ICON_SIZE,
        }}
      />
    </span>
  );
};
