import { applyMiddleware, createStore } from 'redux';
import { isDev } from './services/env';

import combinedReducers from './reducers.ts';

const middlewares = [];

if (isDev) {
  // eslint-disable-next-line no-console
  console.log('logger is disabled');
  // const { logger } = require('redux-logger');
  // middlewares.push(logger);
}

const store = createStore(combinedReducers, applyMiddleware(...middlewares));

export default store;
