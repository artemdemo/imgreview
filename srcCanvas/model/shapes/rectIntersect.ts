import IShape from '../../canvasShapes/Shape/IShape';
import { BoundariesRect, IntersectRect } from '../../custom';

const convertBoundRect = (boundRect: BoundariesRect): IntersectRect => {
  return {
    left: boundRect.x,
    right: boundRect.x + boundRect.width,
    top: boundRect.y,
    bottom: boundRect.y + boundRect.height,
  };
};

/**
 * Found out if two shapes intersect.
 * @source https://stackoverflow.com/a/2752369
 */
export const rectIntersect = (shapeA: IShape, shapeB: IShape) => {
  const iRectA = convertBoundRect(shapeA.getSelfRect());
  const iRectB = convertBoundRect(shapeB.getSelfRect());
  return (
    iRectA.left <= iRectB.right &&
    iRectB.left <= iRectA.right &&
    iRectA.top <= iRectB.bottom &&
    iRectB.top <= iRectA.bottom
  );
};
