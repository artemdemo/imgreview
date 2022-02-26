import { BoundariesRect, IntersectRect } from '../custom';
import { TOneOfShapeTypes } from '../model/shapes/shapesReducer';

const convertBoundRect = (boundRect: BoundariesRect): IntersectRect => {
  return {
    left: boundRect.x,
    right: boundRect.x + boundRect.width,
    top: boundRect.y,
    bottom: boundRect.y + boundRect.height,
  };
};

export const isMeaningfulSize = (boundRect: BoundariesRect): boolean => {
  const { width, height } = boundRect;
  const MIN_SIZE = 8;
  return width > MIN_SIZE && height > MIN_SIZE;
};

/**
 * Found out if two shapes intersect.
 * @source https://stackoverflow.com/a/2752369
 */
export const rectIntersect = (
  boundRectA: BoundariesRect,
  boundRectB: BoundariesRect,
): boolean => {
  const iRectA = convertBoundRect(boundRectA);
  const iRectB = convertBoundRect(boundRectB);
  return (
    iRectA.left <= iRectB.right &&
    iRectB.left <= iRectA.right &&
    iRectA.top <= iRectB.bottom &&
    iRectB.top <= iRectA.bottom
  );
};

export const calcShapesBoundariesRect = (
  list: TOneOfShapeTypes[],
): BoundariesRect => {
  if (list.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const startAcc = {
    xTopLeft: Infinity,
    yTopLeft: Infinity,
    xBottomRight: -Infinity,
    yBottomRight: -Infinity,
  };
  const contentCoordinates = list.reduce((acc, item) => {
    const shapeSelfRect = item.getSelfRect();
    const xBottomRight = shapeSelfRect.x + shapeSelfRect.width;
    const yBottomRight = shapeSelfRect.y + shapeSelfRect.height;
    return {
      xTopLeft: shapeSelfRect.x < acc.xTopLeft ? shapeSelfRect.x : acc.xTopLeft,
      yTopLeft: shapeSelfRect.y < acc.yTopLeft ? shapeSelfRect.y : acc.yTopLeft,
      xBottomRight:
        xBottomRight > acc.xBottomRight ? xBottomRight : acc.xBottomRight,
      yBottomRight:
        yBottomRight > acc.yBottomRight ? yBottomRight : acc.yBottomRight,
    };
  }, startAcc);
  return {
    x: contentCoordinates.xTopLeft,
    y: contentCoordinates.yTopLeft,
    width: contentCoordinates.xBottomRight - contentCoordinates.xTopLeft,
    height: contentCoordinates.yBottomRight - contentCoordinates.yTopLeft,
  };
};
