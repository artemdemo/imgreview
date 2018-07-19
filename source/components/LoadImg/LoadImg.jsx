import React from 'react';
import _get from 'lodash/get';
import * as canvas from '../../canvas/canvas';

class LoadImg extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
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
                const img = new Image();
                img.addEventListener('load', () => {
                    canvas.drawImage(img);
                });
                img.src = e.target.result;
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
