import { BoundariesRect, IntersectRect } from '../custom';

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
