import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { onImageUpdate } from './canvas/api';
import { updateImageSize } from './model/canvas/canvasActions';
import store from './store';
import AppView from './views/AppView.async';

onImageUpdate((data) => {
    store.dispatch(updateImageSize(data));
});

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('app'),
);
