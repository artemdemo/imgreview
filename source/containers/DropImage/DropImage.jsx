import React from 'react';
import classnames from 'classnames';
import _isFunction from 'lodash/isFunction';
import DropzonePkg from 'react-dropzone';
import { connect } from 'react-redux';
import loadImage from '../../services/loadImage';
import { addImage } from '../../model/canvas/canvasActions';
import CanvasImage from '../../canvas/CanvasImage';

import './DropImage.less';

// There is breaking change in webpack 4
// @link https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655
const Dropzone = _isFunction(DropzonePkg) ? DropzonePkg : DropzonePkg.default;

// @docs https://react-dropzone.netlify.com/#proptypes
//
class DropImage extends React.PureComponent {
    onDrop = (files) => {
        const file = files[0];
        const { canvas, addImage } = this.props;
        if (file) {
            loadImage(file)
                .then(({ image, name }) => {
                    // ToDo: this code is duplicate from OpenImageDialog.jsx
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
        const { canvas } = this.props;
        const dropImageClass = classnames({
            'drop-image': true,
            'drop-image_has-image': canvas.image !== null,
        });
        return (
            <Dropzone
                className={dropImageClass}
                activeClassName='drop-image_active'
                onDrop={this.onDrop}
                disableClick
            >
                {this.props.children}
            </Dropzone>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }), {
        addImage,
    },
)(DropImage);
