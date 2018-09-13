import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import loadImage, { addImageToStage } from '../../services/loadImage';
import { addImage } from '../../model/canvas/canvasActions';

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
                .then(addImageToStage(canvas, addImage));
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
