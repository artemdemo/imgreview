import Konva, {TPos} from 'konva';
import * as canvasApi from '../api';
import {distanceBetweenTwoPoints} from '../services/number';

const MIN_CLICK_DISTANCE = 10;

class CanvasImage {
    static clickHandler() {
        canvasApi.blurShapes();
    }

    readonly #image: Konva.Image;
    readonly #cropPosition: TPos;
    #layer: Konva.Layer;

    #mouseIsDown: boolean = false;
    #mouseDownPos: {x: number, y: number} = {x: 0, y: 0};

    constructor(image) {
        this.#cropPosition = {
            x: 0,
            y: 0,
        };
        if (image instanceof Konva.Image) {
            this.#image = image;
        } else {
            this.#image = new Konva.Image({
                image,
            });
        }
    }

    addToLayer(layer: Konva.Layer) {
        this.#layer = layer;
        layer.add(this.#image);
        this.bindClickEvent();
        this.#layer.draw();
    }

    // Standard `click` event is a not good option.
    // You can click on the canvas, keep mouse button down and start dragging,
    // and `click` event will be fired when you release the button.
    // This is bad, since this is what I do, when creating shapes,
    // I don't need blur event right after shape is created.
    bindClickEvent() {
        this.#layer.on('mousedown', (e) => {
            this.#mouseIsDown = true;
            this.#mouseDownPos = {
                x: e.evt.layerX,
                y: e.evt.layerY,
            };
        });
        this.#layer.on('mouseup', (e) => {
            const { x, y } = this.#mouseDownPos
            const dist = distanceBetweenTwoPoints(
                {x, y},
                {x: e.evt.layerX, y: e.evt.layerY},
            );
            if (dist < MIN_CLICK_DISTANCE) {
                CanvasImage.clickHandler();
            }
            this.#mouseIsDown = false;
        });
    }

    crop(x: number, y: number, width: number, height: number) {
        // Image after crop is not overridden completely.
        // Therefore crop X and Y positions always are relative to the original image.
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
        this.#layer.off('click', CanvasImage.clickHandler);
        this.#image.destroy();
    }

    getSize() {
        return {
            width: this.#image.width(),
            height: this.#image.height(),
        };
    }

    setSize(width, height) {
        this.#image.width(width);
        this.#image.height(height);
        this.#layer.draw();
    }
}

export default CanvasImage;
