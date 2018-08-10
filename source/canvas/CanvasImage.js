import Konva from 'konva';

class CanvasImage {
    constructor(props) {
        this._image = new Konva.Image(props);

        this._layer = null;
    }

    addToStage(stage) {
        this._layer = new Konva.Layer();
        this._layer.add(this._image);
        stage.add(this._layer);
    }

    destroy() {
        this._image.destroy();
        this._layer.destroy();
    }
}

export default CanvasImage;
