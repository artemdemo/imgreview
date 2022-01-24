import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import EShapeTypes from '../../../srcCanvas/canvasShapes/Shape/shapeTypes';
import { AppStateContext } from '../../model/AppStateContext';
import s from './MIStrokeColor.module.css';

const ColorSelector = dynamic(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../ColorSelector/ColorSelector'
    ),
  { loading: () => null },
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
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  useEffect(() => {
    const handleShapeClicked = (shape: IShape) => {
      const shapeColor = getShapeColor(shape);
      if (shapeColor) {
        dispatch(setStrokeColor(shapeColor));
      }
    };

    let unsubShapeClicked = _.noop;
    let unsubShapeDragStarted = _.noop;

    if (canvasApi) {
      unsubShapeClicked = canvasApi.onShapeClicked(handleShapeClicked);
      unsubShapeDragStarted = canvasApi.onShapeDragStarted(handleShapeClicked);
    }

    return () => {
      unsubShapeClicked();
      unsubShapeDragStarted();
    };
  }, [canvasApi]);

  return (
    <TopMenuItem
      onClick={() => {
        dispatch(showColorPicker());
      }}
      disabled={disabled}
    >
      <div
        className={s.MIStrokeColor__Current}
        style={{
          backgroundColor: menu.strokeColor,
        }}
      />
      <ColorSelector
        onChange={(color: string) => {
          dispatch(setStrokeColor(color));
          canvasApi?.setStrokeColorToActiveShape(color);

          gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeColor,
            doNotRepeat: true,
          });
        }}
      />
    </TopMenuItem>
  );
};
