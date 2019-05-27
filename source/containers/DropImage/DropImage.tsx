import React from 'react';
import classnames from 'classnames';
import _isFunction from 'lodash/isFunction';
import DropzonePkg from 'react-dropzone';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import loadImage from '../../services/loadImage';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TAddImage, addImage } from '../../model/canvas/canvasActions';

type Props = {
    canvas: TStateCanvas,
    addImage: TAddImage,
};

// There is breaking change in webpack 4
// @link https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655
const Dropzone = _isFunction(DropzonePkg) ? DropzonePkg : (DropzonePkg as any).default;

const DropzoneCss = createGlobalStyle`
    .drop-image {
        min-height: 300px;
        padding: 10px;
        border: 2px dashed lightgray;
        width: 80%;
        margin: 10px auto 0;
        position: relative;
    
        &::before {
            content: 'Drop image here';
            top: 50%;
            left: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            color: gray;
        }
    }
        .drop-image_has-image {
            margin: 0;
            width: auto;
            border: none;
            padding: initial;
            min-height: auto;
            position: initial;
    
            &::before {
                display: none;
            }
        }
        .drop-image_active {
            border-color: lightblue;
        }
`;

// @docs https://react-dropzone.netlify.com/#proptypes
//
class DropImage extends React.PureComponent<Props> {
    onDrop = (files) => {
        const { addImage } = this.props;
        const file = files[0];
        if (file) {
            addImage({
                name: file.name,
            });
            loadImage(file)
                .then(data => canvasApi.setImage(data));
        }
    };

    render() {
        const { canvas } = this.props;
        const dropImageClass = classnames({
            'drop-image': true,
            'drop-image_has-image': canvas.imageHeight !== 0 || canvas.imageWidth !== 0,
        });
        return (
            <React.Fragment>
                <DropzoneCss />
                <Dropzone
                    className={dropImageClass}
                    activeClassName='drop-image_active'
                    onDrop={this.onDrop}
                    disableClick
                >
                    {this.props.children}
                </Dropzone>
            </React.Fragment>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
    }), {
        addImage,
    },
)(DropImage);
