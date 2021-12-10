import { applyMiddleware, createStore } from 'redux';

import combinedReducers from './reducers';

const middlewares: any[] = [];

const store = createStore(combinedReducers, applyMiddleware(...middlewares));

export default store;
