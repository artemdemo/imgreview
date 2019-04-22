import React from 'react';
import classnames from 'classnames';
import _isFunction from 'lodash/isFunction';
import DropzonePkg from 'react-dropzone';
import { connect } from 'react-redux';
import loadImage from '../../services/loadImage';
import { setImage } from '../../canvas/api';

import './DropImage.less';

// There is breaking change in webpack 4
// @link https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655
const Dropzone = _isFunction(DropzonePkg) ? DropzonePkg : DropzonePkg.default;

// @docs https://react-dropzone.netlify.com/#proptypes
//
class DropImage extends React.PureComponent {
    onDrop = (files) => {
        const file = files[0];
        if (file) {
            loadImage(file)
                .then(data => setImage(data));
        }
    };

    render() {
        const { canvas } = this.props;
        const dropImageClass = classnames({
            'drop-image': true,
            'drop-image_has-image': canvas.imageHeight !== 0 || canvas.imageWidth !== 0,
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
    }), {},
)(DropImage);
