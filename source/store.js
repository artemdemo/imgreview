import { applyMiddleware, createStore } from 'redux';

import combinedReducers from './reducers.ts';

const middlewares = [];

try {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('logger is disabled');
        // const { logger } = require('redux-logger');
        // middlewares.push(logger);
    }
} catch (e) {}

const store = createStore(
    combinedReducers,
    applyMiddleware(...middlewares)
);

export default store;
