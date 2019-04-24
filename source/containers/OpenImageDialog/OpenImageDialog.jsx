import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import loadImage from '../../services/loadImage';
import { setImage } from '../../canvas/api';

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
            loadImage(file)
                .then(data => setImage(data));
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

export default OpenImageDialog;
