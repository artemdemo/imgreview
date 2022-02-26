import Konva from 'konva';
import Rect, { RectProps } from './Rect';
import shapeTypes from '../Shape/shapeTypes';
import { BoundariesRect } from '../../custom';

class SelectedFrameRect extends Rect {
  type = shapeTypes.SELECTED_FRAME_RECT;

  constructor(props?: RectProps) {
    super({
      ...props,
      stroke: '#0c7cbd',
      fill: 'transparent',
      strokeWidth: 1,
    });
  }

  applyBoundRectPosition(boundRect: BoundariesRect) {
    this.shape?.setAttrs(boundRect);
  }

  addToAnchorsLayer(anchorsLayer: Konva.Layer) {
    this.defineShape();
    super.attachBasicEvents(this.shape!);
    anchorsLayer.add(this.shape!);
  }

  blur() {
    super.blur();
    this.destroy();
  }

  scale() {
    this.destroy();
  }
}

export default SelectedFrameRect;
