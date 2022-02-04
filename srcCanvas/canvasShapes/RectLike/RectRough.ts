/// <reference path="../../../types/konva.d.ts" />

import Konva, { TPos } from 'konva';
// @ts-ignore
import rough from 'roughjs/bundled/rough.cjs.js';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, { RectProps } from './Rect';
import { getShapesLayerEl } from '../../CanvasEl/CanvasEl';
import * as roughService from '../../services/rough';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import { TScaleProps } from '../Shape/IShape';
import { Drawable } from 'roughjs/bin/core';
import { RoughCanvas } from 'roughjs/bin/canvas';

const ROUGHNESS = 2.5;
const STROKE_DIVIDER = 2;

class RectRough extends Rect {
  type = EShapeTypes.RECT_ROUGH;

  readonly props: RectProps;
  private readonly roughCanvas: RoughCanvas;
  private lastDrawable: Drawable | undefined;
  private isDragging: boolean = false;
  // `substrateKonvaShape` path used to receive mouse events.
  // It's useful since sketched rect will be draggable only on the edge.
  substrateKonvaShape: Konva.Rect | undefined;
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
      fill: 'transparent',
      draggable: true,
      sceneFunc: (context, shape) => {
        const newWidth = shape.getWidth();
        const newHeight = shape.getHeight();
        const stroke = shape.getStroke();
        const strokeWidth = shape.getStrokeWidth();
        if (
          newWidth !== this.prevWidth ||
          newHeight !== this.prevHeight ||
          !this.lastDrawable
        ) {
          this.prevWidth = newWidth;
          this.prevHeight = newHeight;
          this.lastDrawable = this.roughCanvas.generator.rectangle(
            0,
            0,
            newWidth,
            newHeight,
            {
              roughness: ROUGHNESS,
              stroke,
              strokeWidth,
            },
          );
        } else {
          this.lastDrawable.options.stroke = stroke;
          this.lastDrawable.options.strokeWidth = strokeWidth;
        }
        roughService.draw(context, this.lastDrawable);
        context.fillStrokeShape(shape);
      },
    });

    this.substrateKonvaShape = new Konva.Rect({
      x: this.props.x || 0,
      y: this.props.y || 0,
      width: this.props.width || 0,
      height: this.props.height || 0,
      stroke: 'transparent',
      fill: 'transparent',
      draggable: true,
    });

    this.shape.on('dragstart', () => {
      this.isDragging = true;
    });
    this.shape.on('dragend', () => {
      this.isDragging = false;
    });

    this.substrateKonvaShape.on('dragstart', () => {
      this.isDragging = true;
    });
    this.substrateKonvaShape.on('dragend', () => {
      this.isDragging = false;
    });
    this.substrateKonvaShape.on('click', (e) => {
      this.onClick(e);
    });
    this.substrateKonvaShape.on('dragstart', () => {
      this.onDragStart();
    });
    this.substrateKonvaShape.on('mouseover', () => {
      this.cbMap.call('mouseover');
    });
    this.substrateKonvaShape.on('mouseout', () => {
      this.cbMap.call('mouseout');
    });
  }

  setStrokeWidth(strokeWidth: number) {
    super.setStrokeWidth(strokeWidth / STROKE_DIVIDER);
  }

  getStrokeWidth(): number {
    return super.getStrokeWidth() * STROKE_DIVIDER;
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    super.addToLayer(shapesLayer, anchorsLayer);
    if (!this.substrateKonvaShape) {
      throw new Error('`this.substrateKonvaShape` is not defined');
    }
    this.substrateKonvaShape.on('dragmove', this.onDragMoveSubRect);
    shapesLayer.add(this.substrateKonvaShape);
  }

  onDragMoveSubRect = (e: any) => {
    this.cbMap.call('dragmove', e);
    const subRectPos = this.getSizePosSubRect();
    this.sizeTransform?.update(subRectPos);
    this.shape?.setAttrs(subRectPos);
  };

  onDragMoveAnchor = (data: TSizePosition) => {
    this.substrateKonvaShape?.setAttrs(data);
    this.setShapeAttrs(data);
  };

  getSizePosSubRect = (): TSizePosition => {
    const { x, y, width, height } = this.substrateKonvaShape?.getAttrs();
    return {
      x,
      y,
      width,
      height,
    };
  };

  draggable(value: boolean) {
    const result = super.draggable(value);
    this.substrateKonvaShape?.setAttr('draggable', value);
    return result;
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    this.substrateKonvaShape?.setAttrs({
      x: startPos.x,
      y: startPos.y,
      width: currentPos.x - startPos.x,
      height: currentPos.y - startPos.y,
    });
    super.initDraw(startPos, currentPos);
  }

  destroy() {
    super.destroy();
    this.substrateKonvaShape?.destroy();
  }

  scale(scaleProps: TScaleProps) {
    super.scale(scaleProps);
    const { x, y, width, height } = this.getAttrs();
    this.substrateKonvaShape?.setAttrs({
      x,
      y,
      width,
      height,
    });
  }

  crop(cropFramePosition: TPos) {
    super.crop(cropFramePosition);
    const { x, y } = this.getAttrs();
    this.substrateKonvaShape?.setAttrs({
      x,
      y,
    });
  }

  clone(): RectRough {
    const strokeWidth = this.getStrokeWidth();
    return new RectRough({
      ...this.getCloningProps(),
      ...(Number.isNaN(strokeWidth) ? {} : { strokeWidth }),
    });
  }
}

export default RectRough;
