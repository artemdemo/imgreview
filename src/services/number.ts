/* eslint-disable no-self-compare,import/prefer-default-export */

export const couldBeNumber = (value) => {
    if (typeof value === 'string' && value !== '') {
        return Number(value) === Number(value);
    }
    return !isNaN(value) && typeof value === 'number';
};
