import Rect, { RectProps } from './Rect';
import shapeTypes from '../Shape/shapeTypes';

class SelectRect extends Rect {
  type = shapeTypes.SELECT_RECT;

  constructor(props?: RectProps) {
    super({
      ...props,
      stroke: '#0d87dc',
      fill: 'transparent',
      strokeWidth: 2,
      dash: [10, 5],
    });
  }

  blur() {
    super.blur();
    this.destroy();
  }

  scale() {
    this.destroy();
  }
}

export default SelectRect;
