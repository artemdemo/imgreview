import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import * as canvasApi from '../../../srcCanvas/api';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import * as api from '../../../srcCanvas/api';
import { Suspense } from '../../components/Suspense/Suspense';
import './MIStrokeColor.less';
import EShapeTypes from '../../../srcCanvas/canvasShapes/Shape/shapeTypes';
import { AppStateContext } from '../../model/AppStateContext';

const ColorSelector = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../ColorSelector/ColorSelector'
    ),
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

type Props = {
  disabled?: boolean;
};

export const MIStrokeColor: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: { menu },
    dispatch,
  } = useContext(AppStateContext);

  useEffect(() => {
    const handleShapeClicked = (shape: IShape) => {
      const shapeColor = getShapeColor(shape);
      if (shapeColor) {
        dispatch(setStrokeColor(shapeColor));
      }
    };

    const unsubShapeClicked = canvasApi.shapeClicked.on(handleShapeClicked);
    const unsubShapeDragStarted =
      canvasApi.shapeDragStarted.on(handleShapeClicked);
    return () => {
      unsubShapeClicked();
      unsubShapeDragStarted();
    };
  }, []);

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
