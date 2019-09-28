let state = {};

export const __setState = newState => state = newState;

const getState = jest.fn(() => state);

const dispatch = jest.fn();

export default {
    getState,
    dispatch,
};
