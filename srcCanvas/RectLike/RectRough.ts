/// <reference path="../../types/konva.d.ts" />

import Konva, { TPos } from 'konva';
import rough from 'roughjs/bundled/rough.esm.js';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, { TRectProps } from './Rect';
import { getShapesLayerEl } from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import { TScaleProps } from '../Shape/IShape';

const ROUGHNESS = 2.5;

class RectRough extends Rect {
  type = EShapeTypes.RECT_ROUGH;

  readonly props: TRectProps;
  readonly #roughCanvas;
  #lastDrawable;
  #isDragging: boolean = false;
  #isScaling: boolean = false;
  // `substrateKonvaShape` path used to receive mouse events.
  // It's useful since sketched rect will be draggable only on the edge.
  substrateKonvaShape: Konva.Rect;
  shape: Konva.Shape;

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
        const selected = this.isSelected() && !this.#isDragging;
        if (selected || !this.#lastDrawable || this.#isScaling) {
          this.#lastDrawable = this.#roughCanvas.generator.rectangle(
            0,
            0,
            shape.getWidth(),
            shape.getHeight(),
            {
              roughness: ROUGHNESS,
              stroke: shape.getStroke(),
            }
          );
          this.#isScaling = false;
        }
        roughService.draw(context, this.#lastDrawable);
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
      this.#isDragging = true;
    });
    this.shape.on('dragend', () => {
      this.#isDragging = false;
    });

    this.substrateKonvaShape.on('dragstart', () => {
      this.#isDragging = true;
    });
    this.substrateKonvaShape.on('dragend', () => {
      this.#isDragging = false;
    });
    this.substrateKonvaShape.on('click', (e) => {
      this.onClick(e);
    });
    this.substrateKonvaShape.on('dragstart', () => {
      this.onDragStart();
    });
    this.substrateKonvaShape.on('mouseover', () => {
      const mouseoverCb = this.cbMap.get('mouseover');
      mouseoverCb && mouseoverCb();
    });
    this.substrateKonvaShape.on('mouseout', () => {
      const mouseoutCb = this.cbMap.get('mouseout');
      mouseoutCb && mouseoutCb();
    });
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    super.addToLayer(shapesLayer, anchorsLayer);
    this.substrateKonvaShape.on('dragmove', this.onDragMoveSubRect);
    shapesLayer.add(this.substrateKonvaShape);
  }

  onDragMoveSubRect = (e) => {
    const dragmoveCb = this.cbMap.get('dragmove');
    dragmoveCb && dragmoveCb(e);
    const subRectPos = this.getSizePosSubRect();
    this.sizeTransform.update(subRectPos);
    this.shape.setAttrs(subRectPos);
  };

  onDragMoveAnchor = (data: TSizePosition) => {
    this.substrateKonvaShape.setAttrs(data);
    this.setShapeAttrs(data);
  };

  getSizePosSubRect = (): TSizePosition => {
    const { x, y, width, height } = this.substrateKonvaShape.getAttrs();
    return {
      x,
      y,
      width,
      height,
    };
  };

  draggable(value: boolean) {
    const result = super.draggable(value);
    this.substrateKonvaShape.setAttr('draggable', value);
    return result;
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    this.substrateKonvaShape.setAttrs({
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
    this.#isScaling = true;
    super.scale(scaleProps);
    const { x, y, width, height } = this.getAttrs();
    this.substrateKonvaShape.setAttrs({
      x,
      y,
      width,
      height,
    });
  }

  crop(cropFramePosition: TPos) {
    super.crop(cropFramePosition);
    const { x, y } = this.getAttrs();
    this.substrateKonvaShape.setAttrs({
      x,
      y,
    });
  }

  clone(): RectRough {
    return new RectRough(this.getCloningProps());
  }
}

export default RectRough;
