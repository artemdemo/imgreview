import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import { AppStateContext } from '../../model/AppStateContext';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';

type Props = {
  onShapesAmountChanged: () => void;
  onShapeFocus: (shape?: IShape) => void;
};

export const MenuCanvasEvents: React.FC<Props> = (props) => {
  const { onShapesAmountChanged, onShapeFocus } = props;
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  useEffect(() => {
    let unsubShapesBlurred = _.noop;
    let unsubShapeClicked = _.noop;
    let unsubShapeDragStared = _.noop;
    let unsubShapeAdded = _.noop;
    let unsubShapeDeleted = _.noop;

    if (canvasApi) {
      unsubShapesBlurred = canvasApi.onShapesBlurred(onShapeFocus);
      unsubShapeClicked = canvasApi.onShapeClicked((shape) => {
        requestAnimationFrame(() => onShapeFocus(shape));
      });
      unsubShapeDragStared = canvasApi.onShapeDragStarted((shape) => {
        requestAnimationFrame(() => onShapeFocus(shape));
      });
      unsubShapeAdded = canvasApi.onShapeAdded(async ({ addedShape }) => {
        onShapeFocus(addedShape);
        onShapesAmountChanged();
      });
      unsubShapeDeleted = canvasApi.onShapeDeleted(onShapesAmountChanged);
      onShapesAmountChanged();
    }

    return () => {
      unsubShapesBlurred();
      unsubShapeClicked();
      unsubShapeDragStared();
      unsubShapeAdded();
      unsubShapeDeleted();
    };
  }, [canvasApi]);

  return null;
};
