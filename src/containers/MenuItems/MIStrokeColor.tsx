import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import store from '../../store';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/Shape/IShape';
import * as api from '../../../srcCanvas/api';
import { Suspense } from '../../components/Suspense/Suspense';
import './MIStrokeColor.less';
import EShapeTypes from '../../../srcCanvas/Shape/shapeTypes';

const ColorSelector = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../ColorSelector/ColorSelector'
    )
);

const getShapeColor = (shape: IShape): string | undefined => {
  if (_.isFunction(shape.getStrokeColor)) {
    return shape.getStrokeColor();
  }
  if (_.isFunction(shape.getFillColor)) {
    return shape.getFillColor();
  }
  if (shape.type !== EShapeTypes.IMAGE) {
    throw new Error("Can't get shape color");
  }
};

const handleShapeClicked = (shape: IShape) => {
  const shapeColor = getShapeColor(shape);
  if (shapeColor) {
    store.dispatch(setStrokeColor(shapeColor));
  }
};

canvasApi.shapeClicked.on(handleShapeClicked);
canvasApi.shapeDragStarted.on(handleShapeClicked);

type Props = {
  disabled?: boolean;
};

export const MIStrokeColor: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const dispatch = useDispatch();
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);

  return (
    <TopMenuItem
      onClick={() => {
        dispatch(showColorPicker());
      }}
      disabled={disabled}
    >
      <div
        className="MIStrokeColor__Current"
        style={{
          backgroundColor: menu.strokeColor,
        }}
      />
      <Suspense fallback={null}>
        <ColorSelector
          onChange={(color: string) => {
            dispatch(setStrokeColor(color));
            api.setStrokeColorToActiveShape(color);

            gaService.sendEvent({
              eventCategory: gaService.EEventCategories.MenuClick,
              eventAction: gaService.EEventActions.ChangeColor,
            });
          }}
        />
      </Suspense>
    </TopMenuItem>
  );
};
