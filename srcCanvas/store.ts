import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import combinedReducers from './reducers';

const middlewares: any[] = [
  // logger,
];

const store = createStore(combinedReducers, applyMiddleware(...middlewares));

export default store;
