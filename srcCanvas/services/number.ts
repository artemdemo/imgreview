/// <reference path="../../types/konva.d.ts" />

import { TPos } from 'konva';

/**
 * Ensure that value is between given min and max.
 * If it exceeds the borders, then will be returned the closest value.
 * @param value {number}
 * @param min {number}
 * @param max {number}
 * @return {number}
 */
export const ensureBetween = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculating "Inner product space"
 * (see image schema in `Arrow` directory)
 * @link http://qaru.site/questions/465748/inner-angle-between-two-lines/2019402#2019402
 * @link https://en.wikipedia.org/wiki/Inner_product_space
 * @param startPos {object}
 * @param startPos.x {number}
 * @param startPos.y {number}
 * @param endPos {object}
 * @param endPos.x {number}
 * @param endPos.y {number}
 * @return {number} in radians
 */
export const getInnerProductSpace = (startPos: TPos, endPos: TPos) => {
  const deltaXA = 0 - endPos.x;
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
