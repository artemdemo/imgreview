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

  shape: Konva.Shape | undefined;
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
    this.shape = new Konva.Rect({
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

    this.shape!.on('dragmove', this.onDragMove);

    super.attachBasicEvents(this.shape!);

    this.sizeTransform = new SizeTransform(this.getSizePos());
    this.sizeTransform.on('_dragmoveanchor', this.onDragMoveAnchor);

    shapesLayer.add(this.shape!);
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
    return this.shape?.getAttr('fill');
  }

  setFillColor(hex: string) {
    this.shape?.setAttr('fill', hex);
  }

  getStrokeColor(): string {
    return this.shape?.getAttr('stroke');
  }

  getAttrs() {
    return this.shape?.getAttrs();
  }

  hide() {
    this.shape?.setAttrs({
      stroke: 'transparent',
    });
  }

  // `setShapeAttrs` is meant to be used after moving anchors.
  // This way it will only update rectangle, without causing double loop of updates:
  // from anchor to shape and backwards.
  setShapeAttrs(attrs: any) {
    this.shape?.setAttrs(attrs);
    store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
  }

  setAttrs(attrs: any) {
    this.setShapeAttrs(attrs);
    this.sizeTransform?.update(this.getSizePos());
  }

  setStrokeColor(hex: string) {
    this.shape?.setAttr('stroke', hex);
  }

  setStrokeWidth(strokeWidth: number) {
    this.shape?.setAttrs({ strokeWidth });
  }

  getStrokeWidth(): number {
    return this.shape?.getAttr('strokeWidth');
  }

  getSelfRect(): BoundariesRect {
    if (!this.shape) {
      throw new Error('Shape is not defined');
    }
    const absPos = this.shape.getAbsolutePosition();
    const selfRect = this.shape.getSelfRect();
    return {
      x: selfRect.x + absPos.x + (selfRect.width < 0 ? selfRect.width : 0),
      y: selfRect.y + absPos.y + (selfRect.height < 0 ? selfRect.height : 0),
      width: Math.abs(selfRect.width),
      height: Math.abs(selfRect.height),
    };
  }

  draggable(value?: boolean): boolean | undefined {
    if (value === undefined) {
      return this.shape?.draggable();
    }
    this.shape?.draggable(value);
  }

  scale(scaleProps: TScaleProps) {
    const { x, y, width, height } = this.getAttrs();
    this.shape?.setAttrs({
      x: x * scaleProps.wFactor,
      y: y * scaleProps.hFactor,
      width: width * scaleProps.wFactor,
      height: height * scaleProps.hFactor,
    });
    this.sizeTransform?.update(this.getSizePos(), false);
  }

  getCloningProps() {
    const attrs = this.shape?.getAttrs();
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
      return this.shape?.zIndex();
    }
    this.shape?.zIndex(idx);
  }

  crop(cropFramePosition: TPos) {
    const { x, y } = this.getAttrs();
    this.shape?.setAttrs({
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
    this.shape?.destroy();
    this.sizeTransform?.destroy();
  }
}

export default Rect;
