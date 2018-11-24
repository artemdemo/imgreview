import { applyMiddleware, createStore } from 'redux';

import combinedReducers from './reducers';

const middlewares = [];

try {
    if (process.env.NODE_ENV === 'development') {
        // const { logger } = require('redux-logger');
        // middlewares.push(logger);
    }
} catch (e) {}

const store = createStore(
    combinedReducers,
    applyMiddleware(...middlewares)
);

export default store;
