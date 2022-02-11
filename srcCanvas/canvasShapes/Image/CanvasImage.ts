import Konva from 'konva';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import SizeTransform from '../SizeTransform/SizeTransform';
import Shape from '../Shape/Shape';
import IShape, { TScaleProps } from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';
import { BoundariesRect, TPos } from '../../custom';

const MIN_CLICK_DISTANCE = 10;

export type CanvasImageProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

class CanvasImage extends Shape implements IShape {
  type = EShapeTypes.IMAGE;

  private readonly _image: Konva.Image;
  private readonly _props: CanvasImageProps;
  private _sizeTransform: SizeTransform | undefined;

  constructor(
    image: Konva.Image | HTMLImageElement,
    props: CanvasImageProps = {},
  ) {
    super();
    this._props = props;
    if (image instanceof Konva.Image) {
      this._image = image;
    } else {
      this._image = new Konva.Image({
        image,
        draggable: true,
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
      });
    }
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    super.addToLayer(shapesLayer, anchorsLayer);
    this._image.on('dragmove', this.onDragMove);

    this._sizeTransform = new SizeTransform(this.getSizePos());
    this._sizeTransform?.setOriginRatio(
      this._image.width() / this._image.height(),
    );
    this._sizeTransform.on('_dragmoveanchor', this.onDragMoveAnchor);

    super.attachBasicEvents(this._image);

    shapesLayer.add(this._image);
    this._sizeTransform.addToLayer(anchorsLayer);
  }

  onDragMove = () => {
    this._sizeTransform?.update(this.getSizePos());
  };

  onDragMoveAnchor = (attrs: any) => {
    this._image?.setAttrs(attrs);
  };

  destroy() {
    super.destroy();
    this._image.destroy();
    this._sizeTransform?.destroy();
  }

  getSizePos = (): TSizePosition => {
    return {
      x: this._image.x(),
      y: this._image.y(),
      width: this._image.width(),
      height: this._image.height(),
    };
  };

  getSelfRect(): BoundariesRect {
    const absPos = this._image.getAbsolutePosition();
    const selfRect = this._image.getSelfRect();
    return {
      x: selfRect.x + absPos.x,
      y: selfRect.y + absPos.y,
      width: selfRect.width,
      height: selfRect.height,
    };
  }

  blur() {
    super.blur();
    this._sizeTransform?.hide();
  }

  focus() {
    super.focus();
    this._sizeTransform?.show();
  }

  draggable(value: boolean) {
    this._image?.setAttr('draggable', value);
    return this._image?.getAttr('draggable');
  }

  zIndex(idx?: number): number | void {
    if (idx === undefined) {
      return this._image.zIndex();
    }
    this._image.zIndex(idx);
  }

  clone(): CanvasImage {
    return new CanvasImage(this._image.clone(), {
      ...this.getSizePos(),
    });
  }

  initDraw(startPos: TPos, currentPos: TPos): void {}

  scale(scaleProps: TScaleProps): void {}
}

export default CanvasImage;
