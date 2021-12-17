import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColorResult } from 'react-color';
import _ from 'lodash';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import store from '../../store';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/Shape/IShape';
import * as api from '../../../srcCanvas/api';
import './MIStrokeColor.less';

const getShapeColor = (shape: IShape) => {
  if (_.isFunction(shape.getStrokeColor)) {
    return shape.getStrokeColor();
  }
  if (_.isFunction(shape.getFillColor)) {
    return shape.getFillColor();
  }
  throw new Error("Can't get shape color");
};

const handleShapeClicked = (shape: IShape) => {
  const shapeColor = getShapeColor(shape);
  store.dispatch(setStrokeColor(shapeColor));
};

canvasApi.shapeClicked.on(handleShapeClicked);
canvasApi.shapeDragStarted.on(handleShapeClicked);

type Props = {
  disabled: boolean;
  show: boolean;
};

export const MIStrokeColor: React.FC<Props> = (props) => {
  const { disabled, show } = props;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);

  const renderColorSelector = () => {
    return (
      <ColorSelector
        isLoaded={() => {
          setLoading(false);
        }}
        onChangeStrokeColor={(color: ColorResult) => {
          dispatch(setStrokeColor(color.hex));
          api.setStrokeColorToActiveShape(color.hex);

          gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeColor,
          });
        }}
      />
    );
  };

  if (!show && loading) {
    // Here I'm rendering color selector in order to kick-in lazy loading.
    // Color selector wouldn't be shown.
    // After ColorSelector is loaded I can stop rendering it (hence, the `if` statement)
    return renderColorSelector();
  }

  return (
    <TopMenuItem
      onClick={() => {
        dispatch(showColorPicker());
      }}
      show={show}
      disabled={disabled || loading}
    >
      <div
        className="MIStrokeColor__Current"
        style={{
          backgroundColor: menu.strokeColor,
        }}
      />
      {renderColorSelector()}
    </TopMenuItem>
  );
};
