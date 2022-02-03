import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFillColor } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { AppStateContext } from '../../model/AppStateContext';
import s from './MIFillColor.module.css';

const ColorSelector = dynamic(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../ColorSelector/ColorSelector'
    ),
  { loading: () => null },
);

const getShapeFillColor = (shape: IShape): string | undefined => {
  if (_.isFunction(shape.getFillColor)) {
    return shape.getFillColor();
  }
};

type Props = {
  disabled?: boolean;
};

export const MIFillColor: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      menu: { fillColor },
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleShapeClicked = (shape: IShape) => {
      const shapeColor = getShapeFillColor(shape);
      if (shapeColor) {
        dispatch(setFillColor(shapeColor));
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
        setShowColorPicker(true);
      }}
      disabled={disabled}
    >
      <div className={s.FillColor} style={{ backgroundColor: fillColor }} />
      <ColorSelector
        show={showColorPicker}
        onHide={() => {
          setShowColorPicker(false);
        }}
        color={fillColor}
        onChange={(color: string) => {
          dispatch(setFillColor(color));
          // canvasApi?.setFillColorToActiveShape(color);

          gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeStrokeColor,
            doNotRepeat: true,
          });
        }}
      />
    </TopMenuItem>
  );
};
