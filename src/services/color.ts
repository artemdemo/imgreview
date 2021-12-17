import { ColorResult, RGBColor } from 'react-color';
import Color from 'color';

export const convertStrToRgba = (colorStr: string): RGBColor => {
  const colorObj = Color(colorStr).object();
  return {
    r: colorObj.r,
    g: colorObj.g,
    b: colorObj.b,
    a: colorObj.alpha,
  };
};

export const colorToStr = (color: ColorResult): string => {
  return Color(color.hex)
    .alpha(color.rgb.a ?? 1)
    .rgb()
    .toString();
};
