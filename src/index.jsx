import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import * as canvasApi from '../srcCanvas/api';
import { updateCanvasSize } from './model/canvas/canvasActions';
import * as doc from './services/document';
import store from './store';
import AppView from './views/AppView.async';

export const onImageUpdatedCb = (data) => {
    store.dispatch(updateCanvasSize(data));
};

canvasApi.imageUpdated.on(onImageUpdatedCb);

export const App = () => (
    <Provider store={store}>
        <AppView />
    </Provider>
);

const rootElement = doc.getElementById('app');

if (rootElement.hasChildNodes()) {
    ReactDOM.hydrate(<App />, rootElement);
} else {
    ReactDOM.render(<App />, rootElement);
}
