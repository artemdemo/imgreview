import Konva from 'konva';
import Rect, { RectProps } from './Rect';
import shapeTypes from '../Shape/shapeTypes';

class SelectRect extends Rect {
  type = shapeTypes.SELECT_RECT;

  constructor(props?: RectProps) {
    super({
      ...props,
      stroke: '#0e4664',
      fill: 'transparent',
      strokeWidth: 1,
      dash: [10, 5],
    });
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    super.addToLayer(shapesLayer, anchorsLayer);
    this.sizeTransform?.hide();
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
