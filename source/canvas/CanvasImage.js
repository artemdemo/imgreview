import Konva from 'konva';
import {
    blurShapes,
} from '../model/shapes/shapesActions';
import store from '../store';

class CanvasImage {
    static clickHandler() {
        store.dispatch(blurShapes());
    }

    constructor(props) {
        this._image = new Konva.Image(props);

        this._layer = null;
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
