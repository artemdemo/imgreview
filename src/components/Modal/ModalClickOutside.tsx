import React from 'react';
import onClickOutside from 'react-click-outside';

type Props = {
  onClickOutside: () => void;
};

class ModalClickOutside extends React.PureComponent<Props> {
  handleClickOutside = () => {
    const { onClickOutside } = this.props;
    onClickOutside();
  };

  render() {
    return this.props.children;
  }
}

export default onClickOutside(ModalClickOutside);
