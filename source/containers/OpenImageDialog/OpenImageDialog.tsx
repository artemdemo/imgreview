import React from 'react';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { addImage, TAddImage } from '../../model/canvas/canvasActions';
import loadImage from '../../services/loadImage';
import * as canvasApi from '../../../srcCanvas/api';

type Props = {
    addImage: TAddImage;
    open: boolean;
};

class OpenImageDialog extends React.PureComponent<Props> {
    private readonly inputFile: any;

    static readonly defaultProps = {
        open: false,
    };

    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open === false && this.props.open) {
            this.inputFile.current.click();
        }
    }

    onImageLoaded = (file, data) => {
        const { addImage } = this.props;
        canvasApi.setImage(data);
        addImage({
            name: file.name,
        });
    };

    readImage = () => {
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            loadImage(file)
                .then(this.onImageLoaded.bind(null, file));
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

export default connect(
    () => ({}), {
        addImage,
    },
)(OpenImageDialog);
