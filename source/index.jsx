import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import store from './store';
import AppView from './views/AppView.async';

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('app'),
);
