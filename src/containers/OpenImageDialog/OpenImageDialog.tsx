import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { addImage, TAddImage } from '../../model/canvas/canvasActions';
import loadImage from '../../services/loadImage';

type Props = {
  addImage: TAddImage;
  open: boolean;
};

class OpenImageDialog extends React.PureComponent<Props> {
  private readonly inputFile: any;

  static readonly defaultProps = {
    open: false,
  };

  constructor(props) {
    super(props);

    this.inputFile = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open) {
      this.inputFile.current.click();
    }
  }

  onImageLoaded = (data) => {
    const { addImage } = this.props;
    addImage({
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

export default connect(() => ({}), {
  addImage,
})(OpenImageDialog);
