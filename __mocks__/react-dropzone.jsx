import React from 'react';

class Dropzone extends React.PureComponent {
  getRootProps = () => {};

  render() {
    return this.props.children({
      getRootProps: this.getRootProps,
    });
  }
}

export default Dropzone;
