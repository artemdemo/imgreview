/**
 * Ensure that value is between given min and max.
 * If it exceeds the borders, then will be returned the closest value.
 * @param value
 * @param min
 * @param max
 */
export const ensureBetween = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};
