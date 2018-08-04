/* eslint-disable max-len */
/*
 * Original file is from here:
 * https://github.com/artemdemo/pm-app/blob/e4b61405014a805e9165914cc602a95bde99d008/app/source/services/actionCreator.js
 */
export const createAction = (constant, actionFunc) => {
    const resultFunc = (...args) => {
        if (!actionFunc) {
            return {
                type: constant,
            };
        }
        const action = actionFunc(...args);
        return {
            type: constant,
            ...action,
        };
    };

    resultFunc.toString = () => constant;

    return resultFunc;
};
