import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import * as canvasApi from '../srcCanvas/api';
import { updateImageSize } from './model/canvas/canvasActions';
import * as doc from './services/document';
import store from './store';
import AppView from './views/AppView.async';

export const onImageUpdateCb = (data) => {
    store.dispatch(updateImageSize(data));
};

canvasApi.onImageUpdate(onImageUpdateCb);

export const App = () => (
    <Provider store={store}>
        <AppView />
    </Provider>
);

render(
    <App />,
    doc.getElementById('app'),
);
