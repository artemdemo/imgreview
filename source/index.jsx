import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import store from './store';
import AppView from './views/AppView';

import './styles/general.less';

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('app'),
);
