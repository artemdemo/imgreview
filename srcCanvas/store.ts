import { applyMiddleware, createStore, Store } from 'redux';
import logger from 'redux-logger';
import combinedReducers, { TCanvasState } from './reducers';

const middlewares: any[] = [
  // logger,
];

const store: Store<TCanvasState> = createStore(
  combinedReducers,
  applyMiddleware(...middlewares),
);

export default store;
