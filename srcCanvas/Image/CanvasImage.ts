import Konva, { TPos } from 'konva';
import * as canvasApi from '../api';
import { distanceBetweenTwoPoints } from '../services/number';
import { TSizePosition } from '../SizeTransform/SizeTransformAnchorsGroup';
import SizeTransform from '../SizeTransform/SizeTransform';

const MIN_CLICK_DISTANCE = 10;

class CanvasImage {
  static clickHandler() {
    canvasApi.blurShapes();
  }

  readonly #image: Konva.Image;
  readonly #cropPosition: TPos;
  #layer: Konva.Layer | undefined;
  #sizeTransform: SizeTransform | undefined;

  #mouseIsDown: boolean = false;
  #mouseDownPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor(image: Konva.Image | undefined) {
    this.#cropPosition = {
      x: 0,
      y: 0,
    };
    if (image instanceof Konva.Image) {
      this.#image = image;
    } else {
      this.#image = new Konva.Image({
        image,
        draggable: true,
      });
    }
  }

  addToLayer(layer: Konva.Layer) {
    this.#layer = layer;

    this.#image.on('dragmove', this.onDragMove);

    this.#sizeTransform = new SizeTransform(this.getSizePos());
    this.#sizeTransform.on('_dragmoveanchor', this.onDragMoveAnchor);

    this.#layer.add(this.#image);
    this.#sizeTransform.addToLayer(this.#layer);

    this.bindClickEvent();
    this.#layer.draw();
  }

  // Standard `click` event is a not good option.
  // You can click on the canvas, keep mouse button down and start dragging,
  // and `click` event will be fired when you release the button.
  // This is bad, since this is what I do, when creating shapes,
  // I don't need blur event right after shape is created.
  bindClickEvent() {
    this.#layer?.on('mousedown', (e) => {
      this.#mouseIsDown = true;
      this.#mouseDownPos = {
        x: e.evt.layerX,
        y: e.evt.layerY,
      };
    });
    this.#layer?.on('mouseup', (e) => {
      const { x, y } = this.#mouseDownPos;
      const dist = distanceBetweenTwoPoints(
        { x, y },
        { x: e.evt.layerX, y: e.evt.layerY }
      );
      if (dist < MIN_CLICK_DISTANCE) {
        CanvasImage.clickHandler();
      }
      this.#mouseIsDown = false;
    });
  }

  onDragMove = () => {
    this.#sizeTransform?.update(this.getSizePos());
  };

  onDragMoveAnchor = (attrs: any) => {
    this.#image?.setAttrs(attrs);
  };

  crop(x: number, y: number, width: number, height: number) {
    // Image after crop is not overridden completely.
    // Therefore, crop X and Y positions always are relative to the original image.
    this.#cropPosition.x += x;
    this.#cropPosition.y += y;
    this.#image.crop({
      x: this.#cropPosition.x,
      y: this.#cropPosition.y,
      width,
      height,
    });
    this.#image.width(width);
    this.#image.height(height);
  }

  destroy() {
    this.#layer?.off('click', CanvasImage.clickHandler);
    this.#image.destroy();
  }

  getSizePos = (): TSizePosition => {
    return {
      x: this.#image.x(),
      y: this.#image.y(),
      width: this.#image.width(),
      height: this.#image.height(),
    };
  };

  setSize(width: number, height: number) {
    this.#image.width(width);
    this.#image.height(height);
    this.#layer?.draw();
  }
}

export default CanvasImage;
