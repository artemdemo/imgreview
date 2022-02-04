/// <reference path="../../../types/konva.d.ts" />

import Konva from 'konva';
// @ts-ignore
import rough from 'roughjs/bundled/rough.cjs.js';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, { RectProps } from './Rect';
import { getShapesLayerEl } from '../../CanvasEl/CanvasEl';
import * as roughService from '../../services/rough';
import { TScaleProps } from '../Shape/IShape';
import { ROUGH_FILL_WEIGHT, ROUGHNESS, STROKE_DIVIDER } from './constants';

class EllipseRough extends Rect {
  type = EShapeTypes.ELLIPSE_ROUGH;

  readonly props: RectProps;
  private readonly roughCanvas;
  private lastDrawable: any;
  private isDragging: boolean = false;
  shape: Konva.Shape | undefined;

  prevWidth: number = 0;
  prevHeight: number = 0;

  constructor(props: RectProps) {
    super(props);
    this.props = { ...props };
    const shapesCanvasEl = getShapesLayerEl();
    this.roughCanvas = rough.canvas(shapesCanvasEl);
  }

  defineShape() {
    this.shape = new Konva.Shape({
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      stroke: this.props.stroke,
      strokeWidth: this.props.strokeWidth / STROKE_DIVIDER,
      fill: this.props.fill,
      draggable: true,
      sceneFunc: (context, shape) => {
        const newWidth = shape.getWidth();
        const newHeight = shape.getHeight();
        const stroke = shape.getStroke();
        const strokeWidth = shape.getStrokeWidth();
        const fill = shape.fill();
        if (
          newWidth !== this.prevWidth ||
          newHeight !== this.prevHeight ||
          !this.lastDrawable
        ) {
          this.prevWidth = newWidth;
          this.prevHeight = newHeight;
          this.lastDrawable = this.roughCanvas.generator.ellipse(
            newWidth / 2,
            newHeight / 2,
            newWidth,
            newHeight,
            {
              roughness: ROUGHNESS,
              stroke,
              strokeWidth,
              fill,
              fillWeight: ROUGH_FILL_WEIGHT,
            },
          );
        } else {
          this.lastDrawable.options.stroke = stroke;
          this.lastDrawable.options.fill = fill;
          this.lastDrawable.options.strokeWidth = strokeWidth;
        }
        roughService.draw(context, this.lastDrawable);
        context.fillStrokeShape(shape);
      },
    });

    this.shape.on('dragstart', () => {
      this.isDragging = true;
    });
    this.shape.on('dragend', () => {
      this.isDragging = false;
    });
  }

  setStrokeWidth(strokeWidth: number) {
    super.setStrokeWidth(strokeWidth / STROKE_DIVIDER);
  }

  getStrokeWidth(): number {
    return super.getStrokeWidth() * STROKE_DIVIDER;
  }

  scale(scaleProps: TScaleProps) {
    super.scale(scaleProps);
  }

  clone(): EllipseRough {
    const strokeWidth = this.getStrokeWidth();
    return new EllipseRough({
      ...this.getCloningProps(),
      ...(Number.isNaN(strokeWidth) ? {} : { strokeWidth }),
    });
  }
}

export default EllipseRough;
