import Konva from 'konva';
import { TScaleProps } from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import SizeTransform from '../SizeTransform/SizeTransform';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import IGeometricShape from '../Shape/IGeometricShape';
import { drawLayers } from '../../model/shapes/shapesActions';
import { ELayerTypes } from '../../model/shapes/shapesModelTypes';
import store from '../../store';
import { BoundariesRect, TPos } from '../../custom';

export type RectProps = {
  stroke: string;
  fill: string;
  strokeWidth: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  dash?: number[];
};

class Rect extends Shape implements IGeometricShape {
  type = EShapeTypes.RECT;

  private readonly _props: RectProps;
  private _rectShape: Konva.Rect | undefined;
  sizeTransform: SizeTransform | undefined;

  constructor(props: RectProps) {
    super();
    this._props = { ...props };
  }

  onDragMove = (e: any) => {
    this.cbMap.call('dragmove', e);
    this.sizeTransform?.update(this.getSizePos());
  };

  getSizePos = (): TSizePosition => {
    const { x, y, width, height } = this.getAttrs();
    return {
      x,
      y,
      width,
      height,
    };
  };

  onDragMoveAnchor = (data: TSizePosition) => {
    this.setShapeAttrs(data);
  };

  defineShape() {
    this._rectShape = new Konva.Rect({
      x: this._props.x || 0,
      y: this._props.y || 0,
      width: this._props.width || 0,
      height: this._props.height || 0,
      dash: this._props.dash,
      stroke: this._props.stroke,
      strokeWidth: this._props.strokeWidth,
      fill: this._props.fill,
      draggable: true,
    });
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    this.defineShape();

    this._rectShape!.on('dragmove', this.onDragMove);

    super.attachBasicEvents(this._rectShape!);

    this.sizeTransform = new SizeTransform(this.getSizePos());
    this.sizeTransform.on('_dragmoveanchor', this.onDragMoveAnchor);

    shapesLayer.add(this._rectShape!);
    this.sizeTransform.addToLayer(anchorsLayer);

    super.addToLayer(shapesLayer, anchorsLayer);
  }

  blur() {
    super.blur();
    this.sizeTransform?.hide();
  }

  focus() {
    super.focus();
    this.sizeTransform?.show();
  }

  getFillColor(): string {
    return this._rectShape?.getAttr('fill');
  }

  setFillColor(hex: string) {
    this._rectShape?.setAttr('fill', hex);
  }

  getStrokeColor(): string {
    return this._rectShape?.getAttr('stroke');
  }

  getAttrs() {
    return this._rectShape?.getAttrs();
  }

  hide() {
    this._rectShape?.setAttrs({
      stroke: 'transparent',
    });
  }

  // `setShapeAttrs` is meant to be used after moving anchors.
  // This way it will only update rectangle, without causing double loop of updates:
  // from anchor to shape and backwards.
  setShapeAttrs(attrs: any) {
    this._rectShape?.setAttrs(attrs);
    store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
  }

  setAttrs(attrs: any) {
    this.setShapeAttrs(attrs);
    this.sizeTransform?.update(this.getSizePos());
  }

  setStrokeColor(hex: string) {
    this._rectShape?.setAttr('stroke', hex);
  }

  setStrokeWidth(strokeWidth: number) {
    this._rectShape?.setAttrs({ strokeWidth });
  }

  getStrokeWidth(): number {
    return this._rectShape?.getAttr('strokeWidth');
  }

  getSelfRect(): BoundariesRect {
    if (!this._rectShape) {
      throw new Error('Shape is not defined');
    }
    const absPos = this._rectShape.getAbsolutePosition();
    const selfRect = this._rectShape.getSelfRect();
    return {
      x: selfRect.x + absPos.x,
      y: selfRect.y + absPos.y,
      width: selfRect.width,
      height: selfRect.height,
    };
  }

  draggable(value?: boolean): boolean | undefined {
    if (value === undefined) {
      return this._rectShape?.draggable();
    }
    this._rectShape?.draggable(value);
  }

  scale(scaleProps: TScaleProps) {
    const { x, y, width, height } = this.getAttrs();
    this._rectShape?.setAttrs({
      x: x * scaleProps.wFactor,
      y: y * scaleProps.hFactor,
      width: width * scaleProps.wFactor,
      height: height * scaleProps.hFactor,
    });
    this.sizeTransform?.update(this.getSizePos(), false);
  }

  getCloningProps() {
    const attrs = this._rectShape?.getAttrs();
    return {
      ...this._props,
      ...(attrs && {
        x: attrs.x,
        y: attrs.y,
        width: attrs.width,
        height: attrs.height,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
        fill: attrs.fill,
      }),
    };
  }

  zIndex(idx?: number): number | void {
    if (idx === undefined) {
      return this._rectShape?.zIndex();
    }
    this._rectShape?.zIndex(idx);
  }

  crop(cropFramePosition: TPos) {
    const { x, y } = this.getAttrs();
    this._rectShape?.setAttrs({
      x: x - cropFramePosition.x,
      y: y - cropFramePosition.y,
    });
    // I don't need to redraw layer here, since anchors are hidden at this point
    // (I'm referring to the second parameter of `update()`)
    this.sizeTransform?.update(this.getSizePos(), false);
  }

  clone(): Rect {
    return new Rect(this.getCloningProps());
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    // This class is extended by SelectRect.
    // And in case of SelectRect I don't want to blur() since it will destroy it.
    if (this.type === EShapeTypes.RECT) {
      this.blur();
    }
    this.setAttrs({
      x: startPos.x,
      y: startPos.y,
      width: currentPos.x - startPos.x,
      height: currentPos.y - startPos.y,
    });
  }

  destroy() {
    super.destroy();
    this._rectShape?.destroy();
    this.sizeTransform?.destroy();
  }
}

export default Rect;
