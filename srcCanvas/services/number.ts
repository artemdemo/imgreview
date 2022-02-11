/**
 * Ensure that value is between given min and max.
 * If it exceeds the borders, then will be returned the closest value.
 * @param value {number}
 * @param min {number}
 * @param max {number}
 * @return {number}
 */
import { TPos } from '../custom';

export const ensureBetween = (
  value: number,
  min: number,
  max: number,
): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculating "Inner product space"
 * (see image schema in `Arrow` directory)
 * @link https://en.wikipedia.org/wiki/Inner_product_space
 * @param startPos {object}
 * @param endPos {object}
 * @return {number} in radians
 */
export const getInnerProductSpace = (startPos: TPos, endPos: TPos): number => {
  const deltaXA = 0 - Math.abs(endPos.x);
  const deltaXB = startPos.x - endPos.x;
  const deltaYA = 0;
  const deltaYB = startPos.y - endPos.y;
  const lenA = Math.sqrt(deltaXA ** 2 + deltaYA ** 2);
  const lenB = Math.sqrt(deltaXB ** 2 + deltaYB ** 2);
  const nominator = deltaXA * deltaXB + deltaYA * deltaYB;
  const denominator = lenA * lenB;
  if (denominator === 0) {
    return 0;
  }
  const angle = Math.acos(nominator / denominator);
  if (startPos.y > endPos.y) {
    return 2 * Math.PI - angle;
  }
  return angle;
};

export const distanceBetweenTwoPoints = (pointA: TPos, pointB: TPos) => {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
};
