import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import * as canvasApi from '../srcCanvas/api';
import { updateImageSize } from './model/canvas/canvasActions';
import store from './store';
import AppView from './views/AppView.async';

canvasApi.onImageUpdate((data) => {
    store.dispatch(updateImageSize(data));
});

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('app'),
);
