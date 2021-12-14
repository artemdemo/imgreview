/* eslint-disable no-self-compare,import/prefer-default-export */

export const couldBeNumber = (value: any) => {
  if (typeof value === 'string' && value !== '') {
    return Number(value) === Number(value);
  }
  return !isNaN(value) && typeof value === 'number';
};
