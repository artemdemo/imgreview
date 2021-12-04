import React from 'react';

class Popup extends React.PureComponent {
  render() {
    return <div data-mock="Popup">{this.props.children}</div>;
  }
}

export default Popup;
