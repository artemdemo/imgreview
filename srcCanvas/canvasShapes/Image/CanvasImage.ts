import Konva, { BoundariesRect, TPos } from 'konva';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import SizeTransform from '../SizeTransform/SizeTransform';
import Shape from '../Shape/Shape';
import IShape, { TScaleProps } from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';

const MIN_CLICK_DISTANCE = 10;

export type CanvasImageProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

class CanvasImage extends Shape implements IShape {
  type = EShapeTypes.IMAGE;

  readonly #image: Konva.Image;
  readonly #props: CanvasImageProps;
  #sizeTransform: SizeTransform | undefined;

  constructor(image: Konva.Image | undefined, props: CanvasImageProps = {}) {
    super();
    this.#props = props;
    if (image instanceof Konva.Image) {
      this.#image = image;
    } else {
      this.#image = new Konva.Image({
        image,
        draggable: true,
        x: props.x,
        y: props.y,
      });
    }
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    this.#image.on('dragmove', this.onDragMove);

    this.#sizeTransform = new SizeTransform(this.getSizePos());
    this.#sizeTransform?.setOriginRatio(
      this.#image.width() / this.#image.height()
    )
    this.#sizeTransform.on('_dragmoveanchor', this.onDragMoveAnchor);

    super.attachBasicEvents(this.#image);

    shapesLayer.add(this.#image);
    this.#sizeTransform.addToLayer(anchorsLayer);
  }

  onDragMove = () => {
    this.#sizeTransform?.update(this.getSizePos());
  };

  onDragMoveAnchor = (attrs: any) => {
    this.#image?.setAttrs(attrs);
  };

  destroy() {
    super.destroy();
    this.#image.destroy();
    this.#sizeTransform?.destroy();
  }

  getSizePos = (): TSizePosition => {
    return {
      x: this.#image.x(),
      y: this.#image.y(),
      width: this.#image.width(),
      height: this.#image.height(),
    };
  };

  getSelfRect(): BoundariesRect {
    const absPos = this.#image.getAbsolutePosition();
    const selfRect = this.#image.getSelfRect();
    return {
      x: selfRect.x + absPos.x,
      y: selfRect.y + absPos.y,
      width: selfRect.width,
      height: selfRect.height,
    };
  }

  blur() {
    super.blur();
    this.#sizeTransform?.hide();
  }

  focus() {
    super.focus();
    this.#sizeTransform?.show();
  }

  draggable(value: boolean) {
    this.#image?.setAttr('draggable', value);
    return this.#image?.getAttr('draggable');
  }

  clone(): CanvasImage {
    return new CanvasImage(this.#image, {
      ...this.getSizePos(),
    });
  }

  initDraw(startPos: TPos, currentPos: TPos): void {}

  scale(scaleProps: TScaleProps): void {}
}

export default CanvasImage;
