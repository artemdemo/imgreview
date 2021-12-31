import React from 'react';
import _ from 'lodash';
import loadImage, { LoadImageResult } from '../../services/loadImage';
import * as canvasApi from '../../../srcCanvas/api';

type Props = {
  open: boolean;
};

class OpenImageDialog extends React.PureComponent<Props> {
  private readonly inputFile: any;

  static readonly defaultProps = {
    open: false,
  };

  constructor(props: Props) {
    super(props);

    this.inputFile = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.open && this.props.open) {
      this.inputFile.current.click();
    }
  }

  onImageLoaded = (data: LoadImageResult) => {
    canvasApi.setImage({
      image: data.image,
      name: data.name,
    });
  };

  readImage = () => {
    const file = _.get(this.inputFile, 'current.files[0]', null);

    if (file) {
      loadImage(file).then(this.onImageLoaded);
    }
  };

  render() {
    return (
      <input
        type="file"
        onChange={this.readImage}
        ref={this.inputFile}
        style={{ display: 'none' }}
      />
    );
  }
}

export default OpenImageDialog;
