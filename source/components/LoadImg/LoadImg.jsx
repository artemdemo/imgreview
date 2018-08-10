import React from 'react';
import _get from 'lodash/get';
import store from '../../store';
import CanvasImage from '../../canvas/CanvasImage';

class LoadImg extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
        this.canvasImage = null;
    }

    /**
     * @public
     */
    loadImg() {
        this.inputFile.current.click();
    }

    readImage = () => {
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            const FR = new FileReader();
            FR.onload = (e) => {
                const image = new Image();
                image.addEventListener('load', () => {
                    const { canvas } = store.getState();
                    canvas.stage.setAttr('width', image.width);
                    canvas.stage.setAttr('height', image.height);
                    if (this.canvasImage) {
                        this.canvasImage.destroy();
                    }
                    this.canvasImage = new CanvasImage({
                        image,
                    });
                    this.canvasImage.addToStage(canvas.stage);
                });
                image.src = e.target.result;
            };
            FR.readAsDataURL(file);
        }
    };

    render() {
        return (
            <input
                type='file'
                onChange={this.readImage}
                ref={this.inputFile}
                style={{display: 'none'}}
            />
        );
    }
}

export default LoadImg;
