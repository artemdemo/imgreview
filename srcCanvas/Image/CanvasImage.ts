import Konva from 'konva';
import * as canvasApi from '../api';

class CanvasImage {
    static clickHandler() {
        canvasApi.blurShapes();
    }

    readonly #image: Konva.Image;
    #layer: Konva.Layer;

    constructor(props) {
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
        this.#image.cropX(x);
        this.#image.cropY(y);
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
