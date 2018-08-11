import React from 'react';
import _get from 'lodash/get';
import loadImage from '../../services/loadImage';

class OpenImageDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
    }

    /**
     * @public
     */
    openDialog() {
        this.inputFile.current.click();
    }

    readImage = () => {
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            loadImage(file);
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

export default OpenImageDialog;
