import Konva from 'konva';

class Image {
    constructor(mainStage) {
        this._stage = mainStage;
        this._layer = null;
        this._img = null;
    }

    /**
     * Set image to the stage
     * @param props {object} https://konvajs.github.io/api/Konva.Image.html
     */
    setImage(props) {
        this._layer = new Konva.Layer();
        this._img = new Konva.Image(props);
        this._layer.add(this._img);
        this._stage.add(this._layer);
    }
}

export default Image;
