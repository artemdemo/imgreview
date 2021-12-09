/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { TStateCanvas } from '../../../model/canvas/canvasReducer';
import { TReduxState } from '../../../reducers';
import TopMenuItem from '../../../components/TopMenu/TopMenuItem';
import MIResizePopup from './MIResizePopup';
import * as canvasApi from '../../../../srcCanvas/api';
import { t } from '../../../services/i18n';

type Props = {
  disabled: boolean;
  canvas: TStateCanvas;
};

type State = {
  width: number;
  height: number;
  showPopup: boolean;
};

class MIResize extends React.PureComponent<Props, State> {
  static readonly defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      showPopup: false
    };
  }

  onClick = () => {
    const { canvas } = this.props;
    this.setState(
      {
        width: canvas.width,
        height: canvas.height,
        showPopup: true,
      }
    );
  };

  onSubmit = (values) => {
    const width = Number(values.width);
    const height = Number(values.height);
    if (width > 0 && height > 0) {
      this.setState({
        width: 0,
        height: 0,
        showPopup: false,
      });
      canvasApi.updateCanvasSize({ width, height });
    }
  };

  render() {
    const { disabled } = this.props;
    return (
      <>
        <TopMenuItem
          onClick={this.onClick}
          disabled={disabled}
          title={t('menu.resize')}
          stopPropagation={false}
        >
          <FontAwesomeIcon icon={faExpandAlt} />
        </TopMenuItem>
        <MIResizePopup
          widthInit={this.state.width}
          heightInit={this.state.height}
          onSubmit={this.onSubmit}
          onCancel={() => {
            this.setState({ showPopup: false });
          }}
          show={this.state.showPopup}
        />
      </>
    );
  }
}

export default connect((state: TReduxState) => ({
  canvas: state.canvas,
}))(MIResize);
