import React from 'react';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import loadImage, { LoadImageResult } from '../../services/loadImage';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TAddImage, addImage } from '../../model/canvas/canvasActions';
import * as gaService from '../../services/ganalytics';
import './DropImage.less';

type TProps = {
  canvas: TStateCanvas;
  addImage: TAddImage;
  children: any;
};

// @docs https://react-dropzone.netlify.com/#proptypes
//
class DropImage extends React.PureComponent<TProps> {
  onDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      loadImage(file).then((data: LoadImageResult) => {
        const { addImage } = this.props;
        addImage({
          image: data.image,
          name: data.name,
        });
      });
    }
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.GlobalInteraction,
      eventAction: gaService.EEventActions.DropImage,
    });
  };

  renderDropZone = (propsZone: any) => {
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
    return <Dropzone onDrop={this.onDrop}>{this.renderDropZone}</Dropzone>;
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
