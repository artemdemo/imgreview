import { applyMiddleware, createStore } from "redux";

import combinedReducers from "./reducers";

const middlewares = [];

const store = createStore(
    combinedReducers,
    applyMiddleware(...middlewares)
);

export default store;
