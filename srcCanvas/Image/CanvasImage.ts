import Konva, {TPos} from 'konva';
import * as canvasApi from '../api';

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

    constructor(props) {
        this.#cropPosition = {
            x: 0,
            y: 0,
        };
        this.#image = new Konva.Image(props);
    }

    addToStage(stage) {
        this.#layer = new Konva.Layer({
            name: 'test',
        });
        this.#layer.add(this.#image);
        this.bindClickEvent();
        stage.add(this.#layer);
        this.#layer.moveToBottom();
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
            const dist = Math.sqrt(
                (x - e.evt.layerX)**2 + (y - e.evt.layerY)**2
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
        this.#image.cropX(this.#cropPosition.x);
        this.#image.cropY(this.#cropPosition.y);
        this.#image.cropWidth(width);
        this.#image.cropHeight(height);
        this.#image.width(width);
        this.#image.height(height);
        this.#layer.draw();
    }

    destroy() {
        this.#layer.off('click', CanvasImage.clickHandler);
        this.#image.destroy();
        this.#layer.destroy();
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
