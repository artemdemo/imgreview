/// <reference path="../../types/konva.d.ts" />

import Konva, { TPos } from 'konva';
import EShapeTypes from '../Shape/shapeTypes';
import SizeTransform from '../SizeTransform/SizeTransform';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import Rect, { RectProps } from './Rect';
import { TScaleProps } from '../Shape/IShape';

class Ellipse extends Rect {
  type = EShapeTypes.ELLIPSE;

  readonly props: RectProps;
  shape: Konva.Ellipse | undefined;
  sizeTransform: SizeTransform | undefined;

  constructor(props: RectProps) {
    super(props);
    this.props = { ...props };
  }

  getSizePos = (): TSizePosition => {
    const { x, y, radiusX, radiusY } = this.getAttrs();
    return {
      x: x - radiusX,
      y: y - radiusY,
      width: radiusX * 2,
      height: radiusY * 2,
    };
  };

  onDragMoveAnchor = (data: TSizePosition) => {
    data.x = data.x + data.width / 2;
    data.y = data.y + data.height / 2;
    this.setShapeAttrs(data);
  };

  defineShape() {
    this.shape = new Konva.Ellipse({
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      dash: this.props.dash,
      stroke: this.props.stroke,
      strokeWidth: this.props.strokeWidth,
      fill: this.props.fill,
      draggable: true,
    });
  }

  getCloningProps() {
    const attrs = this.shape?.getAttrs();
    // Here I'm changing `x` and `y` to match top-left corner of the shape.
    // This way the result of this method could be easily used for sketchifying.
    return {
      ...this.props,
      ...(attrs && {
        x: attrs.x - attrs.radiusX,
        y: attrs.y - attrs.radiusY,
        width: attrs.radiusX * 2,
        height: attrs.radiusY * 2,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
      }),
    };
  }

  clone(): Ellipse {
    const cloningProps = this.getCloningProps();
    cloningProps.x += cloningProps.width / 4;
    cloningProps.y += cloningProps.height / 4;
    return new Ellipse(cloningProps);
  }

  scale(scaleProps: TScaleProps) {
    const { x, y, radiusX, radiusY } = this.getAttrs();
    this.shape?.setAttrs({
      x: x * scaleProps.wFactor,
      y: y * scaleProps.hFactor,
      width: radiusX * 2 * scaleProps.wFactor,
      height: radiusY * 2 * scaleProps.hFactor,
    });
    this.sizeTransform?.update(this.getSizePos(), false);
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    this.blur();
    const width = currentPos.x - startPos.x;
    const height = currentPos.y - startPos.y;
    this.setAttrs({
      x: startPos.x + width / 2,
      y: startPos.y + height / 2,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }
}

export default Ellipse;
