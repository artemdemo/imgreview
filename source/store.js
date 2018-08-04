import { createStore } from 'redux';

import combinedReducers from './reducers';

const store = createStore(combinedReducers);

export default store;
