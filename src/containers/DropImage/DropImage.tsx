import React from 'react';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import loadImage from '../../services/loadImage';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TAddImage, addImage } from '../../model/canvas/canvasActions';
import * as gaService from '../../services/ganalytics';

type TProps = {
  canvas: TStateCanvas;
  addImage: TAddImage;
};

const DropzoneCss = createGlobalStyle`
    .drop-image {
        min-height: 300px;
        padding: 10px;
        border: 2px dashed lightgray;
        width: 80%;
        margin: 10px auto 0;
        position: relative;
        outline: none;

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
class DropImage extends React.PureComponent<TProps> {
  onImageLoaded = (data) => {
    const { addImage } = this.props;
    addImage({
      image: data.image,
      name: data.name,
    });
  };

  onDrop = (files) => {
    const file = files[0];
    if (file) {
      loadImage(file).then(this.onImageLoaded);
    }
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.GlobalInteraction,
      eventAction: gaService.EEventActions.DropImage,
    });
  };

  renderDropZone = (propsZone) => {
    const { getRootProps } = propsZone;
    const { canvas } = this.props;
    const dropImageClass = classnames({
      'drop-image': true,
      'drop-image_has-image': canvas.height !== 0 || canvas.width !== 0,
      'drop-image_active': propsZone.isDragActive,
    });
    return (
      <div {...getRootProps()} className={dropImageClass}>
        {this.props.children}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <DropzoneCss />
        <Dropzone onDrop={this.onDrop}>{this.renderDropZone}</Dropzone>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    canvas: state.canvas,
  }),
  {
    addImage,
  }
)(DropImage);
