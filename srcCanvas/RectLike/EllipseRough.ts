/// <reference path="../../types/konva.d.ts" />

import Konva from 'konva';
// @ts-ignore
import rough from 'roughjs/bundled/rough.esm.js';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, { TRectProps } from './Rect';
import { getShapesLayerEl } from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';
import { TScaleProps } from '../Shape/IShape';

const ROUGHNESS = 2.5;

class EllipseRough extends Rect {
  type = EShapeTypes.ELLIPSE_ROUGH;

  readonly props: TRectProps;
  readonly #roughCanvas;
  #lastDrawable: any;
  #isDragging: boolean = false;
  shape: Konva.Shape | undefined;

  prevWidth: number = 0;
  prevHeight: number = 0;

  constructor(props: TRectProps) {
    super(props);
    this.props = { ...props };
    const shapesCanvasEl = getShapesLayerEl();
    this.#roughCanvas = rough.canvas(shapesCanvasEl);
  }

  defineShape() {
    this.shape = new Konva.Shape({
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      stroke: this.props.stroke,
      strokeWidth: this.props.strokeWidth / 2,
      fill: 'transparent',
      draggable: true,
      sceneFunc: (context, shape) => {
        const newWidth = shape.getWidth();
        const newHeight = shape.getHeight();
        if (
          newWidth !== this.prevWidth ||
          newHeight !== this.prevHeight ||
          !this.#lastDrawable
        ) {
          this.prevWidth = newWidth;
          this.prevHeight = newHeight;
          this.#lastDrawable = this.#roughCanvas.generator.ellipse(
            newWidth / 2,
            newHeight / 2,
            newWidth,
            newHeight,
            {
              roughness: ROUGHNESS,
              stroke: shape.getStroke(),
            }
          );
        } else {
          this.#lastDrawable.options.stroke = shape.getStroke();
        }
        roughService.draw(context, this.#lastDrawable);
        context.fillStrokeShape(shape);
      },
    });

    this.shape.on('dragstart', () => {
      this.#isDragging = true;
    });
    this.shape.on('dragend', () => {
      this.#isDragging = false;
    });
  }

  scale(scaleProps: TScaleProps) {
    super.scale(scaleProps);
  }

  clone(): EllipseRough {
    return new EllipseRough(this.getCloningProps());
  }
}

export default EllipseRough;
