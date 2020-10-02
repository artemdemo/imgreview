import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import combinedReducers from './reducers';

const middlewares = [
    // logger,
];

const store = createStore(
    combinedReducers,
    applyMiddleware(...middlewares)
);

export default store;
