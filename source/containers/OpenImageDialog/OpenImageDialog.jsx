import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { addImage } from '../../model/canvas/canvasActions';
import loadImage from '../../services/loadImage';
import * as canvasApi from '../../../srcCanvas/api';

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
        const { addImage } = this.props;
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            addImage({
                name: file.name,
            });
            loadImage(file)
                .then(data => canvasApi.setImage(data));
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
    () => ({}), {
        addImage,
    },
)(OpenImageDialog);
