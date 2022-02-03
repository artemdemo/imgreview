import { TOneOfShapeTypes } from '../model/shapes/shapesReducer';
import { TPos } from 'konva';
import EShapeTypes from '../canvasShapes/Shape/shapeTypes';

type ApplyInitDrawOptions = {
  shape: TOneOfShapeTypes;
  startPos: TPos;
  currentPos: TPos;
  ratioShiftIsActive: boolean;
};
export const applyInitDraw = (options: ApplyInitDrawOptions): void => {
  const { shape, startPos, currentPos, ratioShiftIsActive } = options;
  if (ratioShiftIsActive) {
    if (shape.type !== EShapeTypes.ARROW && shape.type !== EShapeTypes.TEXT) {
      const horizontalDiff = currentPos.x - startPos.x;
      const verticalDiff = currentPos.y - startPos.y;
      const ratioWidth = Math.min(
        Math.abs(horizontalDiff),
        Math.abs(verticalDiff),
      );
      shape.initDraw(startPos, {
        x: startPos.x + Math.sign(horizontalDiff) * ratioWidth,
        y: startPos.y + Math.sign(verticalDiff) * ratioWidth,
      });
      return;
    }
  }
  shape.initDraw(startPos, currentPos);
};
