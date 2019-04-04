import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import Promise from 'bluebird';
import store from './store';
import AppView from './views/AppView';

import './styles/general.less';

Promise.config({
    cancellation: true,
});

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('app'),
);
