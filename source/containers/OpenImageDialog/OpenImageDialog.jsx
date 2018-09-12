import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import loadImage from '../../services/loadImage';
import { addImage } from '../../model/canvas/canvasActions';
import CanvasImage from '../../canvas/CanvasImage';

class OpenImageDialog extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open === false && this.props.open === true) {
            this.inputFile.current.click();
        }
    }

    readImage = () => {
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            const { canvas, addImage } = this.props;
            loadImage(file)
                .then(({ image, name }) => {
                    if (canvas.image) {
                        canvas.image.destroy();
                    }
                    canvas.stage.setAttr('width', image.width);
                    canvas.stage.setAttr('height', image.height);
                    const canvasImage = new CanvasImage({
                        image,
                    });
                    canvasImage.addToStage(canvas.stage);
                    addImage(canvasImage, name);
                });
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

OpenImageDialog.propTypes = {
    open: PropTypes.bool,
};

OpenImageDialog.defaultProps = {
    open: false,
};

export default connect(
    state => ({
        canvas: state.canvas,
    }), {
        addImage,
    },
)(OpenImageDialog);
