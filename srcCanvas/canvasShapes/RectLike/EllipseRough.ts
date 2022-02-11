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
  ellipseShape: Konva.Shape | undefined;

  prevWidth: number = 0;
  prevHeight: number = 0;

  constructor(props: RectProps) {
    super(props);
    this.props = { ...props };
    const shapesCanvasEl = getShapesLayerEl();
    this.roughCanvas = rough.canvas(shapesCanvasEl);
  }

  defineShape() {
    this.ellipseShape = new Konva.Shape({
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
              fill: this.props.fill,
              fillWeight: ROUGH_FILL_WEIGHT,
            },
          );
        } else {
          this.lastDrawable.options.stroke = stroke;
          this.lastDrawable.options.fill = this.props.fill;
          this.lastDrawable.options.strokeWidth = strokeWidth;
        }
        // ToDo: I don't like how context is passed.
        //  Looks like I'm using private property.
        //  Is there another way?
        roughService.draw(context._context, this.lastDrawable);
        context.fillStrokeShape(shape);
      },
    });

    this.ellipseShape.on('dragstart', () => {
      this.isDragging = true;
    });
    this.ellipseShape.on('dragend', () => {
      this.isDragging = false;
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
