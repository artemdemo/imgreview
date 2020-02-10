import Konva from 'konva/konva';
import * as canvasApi from '../api';

class CanvasImage {
    static clickHandler() {
        canvasApi.blurShapes();
    }

    private readonly _image: Konva.Image;
    private _layer: Konva.Layer;

    constructor(props) {
        this._image = new Konva.Image(props);
    }

    addToStage(stage) {
        this._layer = new Konva.Layer();
        this._layer.add(this._image);
        this._layer.on('click', CanvasImage.clickHandler);
        stage.add(this._layer);
    }

    destroy() {
        this._layer.off('click', CanvasImage.clickHandler);
        this._image.destroy();
        this._layer.destroy();
    }

    getSize() {
        return {
            width: this._image.width(),
            height: this._image.height(),
        };
    }

    setSize(width, height) {
        this._image.width(width);
        this._image.height(height);
        this._layer.draw();
    }
}

export default CanvasImage;
