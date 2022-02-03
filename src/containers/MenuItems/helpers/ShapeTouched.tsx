import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import IShape from '../../../../srcCanvas/canvasShapes/Shape/IShape';
import { AppStateContext } from '../../../model/AppStateContext';

type Props = {
  onTouched: (shape: IShape) => void;
};

export const ShapeTouched: React.FC<Props> = (props) => {
  const { onTouched } = props;
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

  return null;
};
