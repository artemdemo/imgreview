/* eslint-disable no-self-compare */
export const couldBeNumber = (value) => {
    if (typeof value === 'string' && value !== '') {
        return Number(value) === Number(value);
    }
    return !isNaN(value) && typeof value === 'number';
};
