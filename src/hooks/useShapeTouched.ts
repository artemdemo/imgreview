import IShape from '../../srcCanvas/canvasShapes/Shape/IShape';
import { useContext, useEffect } from 'react';
import { AppStateContext } from '../model/AppStateContext';
import _ from 'lodash';

export const useShapeTouched = (onTouched: (shape: IShape) => void) => {
  const {
    state: {
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  useEffect(() => {
    const handleShapeTouched = (shape: IShape) => {
      onTouched(shape);
    };

    let unsubShapeClicked = _.noop;
    let unsubShapeDragStarted = _.noop;

    if (canvasApi) {
      unsubShapeClicked = canvasApi.onShapeClicked(handleShapeTouched);
      unsubShapeDragStarted = canvasApi.onShapeDragStarted(handleShapeTouched);
    }

    return () => {
      unsubShapeClicked();
      unsubShapeDragStarted();
    };
  }, [canvasApi, onTouched]);
};
