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
  private readonly _roughCanvas;
  private _lastDrawable: any;
  private _isDragging: boolean = false;
  shape: Konva.Shape | undefined;

  prevWidth: number = 0;
  prevHeight: number = 0;

  constructor(props: RectProps) {
    super(props);
    this.props = { ...props };
    const shapesCanvasEl = getShapesLayerEl();
    this._roughCanvas = rough.canvas(shapesCanvasEl);
  }

  defineShape() {
    this.shape = new Konva.Shape({
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      stroke: this.props.stroke,
      strokeWidth: this.props.strokeWidth / STROKE_DIVIDER,
      fill: 'transparent',
      draggable: true,
      sceneFunc: (context, shape) => {
        const newWidth = shape.width();
        const newHeight = shape.height();
        const stroke = shape.stroke();
        const strokeWidth = shape.strokeWidth();
        if (
          newWidth !== this.prevWidth ||
          newHeight !== this.prevHeight ||
          !this._lastDrawable
        ) {
          this.prevWidth = newWidth;
          this.prevHeight = newHeight;
          this._lastDrawable = this._roughCanvas.generator.ellipse(
            newWidth / 2,
            newHeight / 2,
            newWidth,
            newHeight,
            {
              roughness: ROUGHNESS,
              stroke,
              strokeWidth,
              fill: this.props.fill,
              fillWeight: ROUGH_FILL_WEIGHT,
            },
          );
        } else {
          this._lastDrawable.options.stroke = stroke;
          this._lastDrawable.options.fill = this.props.fill;
          this._lastDrawable.options.strokeWidth = strokeWidth;
        }
        roughService.draw(context._context, this._lastDrawable);
        context.fillStrokeShape(shape);
      },
    });

    this.shape.on('dragstart', () => {
      this._isDragging = true;
    });
    this.shape.on('dragend', () => {
      this._isDragging = false;
    });
  }

  setFillColor(hex: string) {
    this.props.fill = hex;
  }

  getFillColor(): string {
    return this.props.fill;
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
      fill: this.props.fill,
    });
  }
}

export default EllipseRough;
