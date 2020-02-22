import Konva from 'konva/konva';
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
