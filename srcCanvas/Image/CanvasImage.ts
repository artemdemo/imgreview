import Konva, {TPos} from 'konva';
import * as canvasApi from '../api';

class CanvasImage {
    static clickHandler() {
        canvasApi.blurShapes();
    }

    readonly #image: Konva.Image;
    readonly #cropPosition: TPos;
    #layer: Konva.Layer;

    constructor(props) {
        this.#cropPosition = {
            x: 0,
            y: 0,
        };
        this.#image = new Konva.Image(props);
    }

    addToStage(stage) {
        this.#layer = new Konva.Layer();
        this.#layer.add(this.#image);
        this.#layer.on('click', CanvasImage.clickHandler);
        stage.add(this.#layer);
        this.#layer.moveToBottom();
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
