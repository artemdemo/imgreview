import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import store from '../../store';
import * as gaService from '../../services/ganalytics';

const getShapeColor = (shape: any) => {
  if (_.isFunction(shape.getStrokeColor)) {
    return shape.getStrokeColor();
  }
  if (_.isFunction(shape.getFillColor)) {
    return shape.getFillColor();
  }
  throw new Error("Can't get shape color");
};

canvasApi.shapeClicked.on((shape: canvasApi.TShapeClicked) => {
  const shapeColor = getShapeColor(shape);
  store.dispatch(setStrokeColor(shapeColor));
});

const MIStrokeColor__Current = styled.div`
  display: inline-block;
  width: 20px;
  height: 18px;
  vertical-align: bottom;
`;

type TProps = {
  menu: TStateMenu;
  showColorPicker: () => void;
  disabled: boolean;
  show: boolean;
};

type TState = {
  loading: boolean;
};

class MIStrokeColor extends React.PureComponent<TProps, TState> {
  static readonly defaultProps = {
    disabled: false,
    show: false,
  };

  state = {
    loading: true,
  };

  onClick = () => {
    const { showColorPicker } = this.props;
    showColorPicker();
  };

  colorSelectorIsReady = () => {
    this.setState({
      loading: false,
    });
  };

  handleChangeStrokeColor = (color: string) => {
    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeColor,
    });
  };

  renderColorSelector() {
    return (
      <ColorSelector
        isLoaded={this.colorSelectorIsReady}
        onChangeStrokeColor={this.handleChangeStrokeColor}
      />
    );
  }

  render() {
    const { disabled, show, menu } = this.props;
    if (!show && this.state.loading) {
      // Here I'm rendering color selector in order to kick-in lazy loading.
      // Color selector wouldn't be shown.
      // After ColorSelector is loaded I can stop rendering it (hence, the `if` statement)
      return this.renderColorSelector();
    }
    return (
      <TopMenuItem
        onClick={this.onClick}
        show={show}
        disabled={disabled || this.state.loading}
      >
        <MIStrokeColor__Current
          style={{
            backgroundColor: menu.strokeColor,
          }}
        />
        {this.renderColorSelector()}
      </TopMenuItem>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    menu: state.menu,
  }),
  {
    showColorPicker,
  }
)(MIStrokeColor);
