import React from 'react';
import { render } from 'react-dom';
import AppView from './views/AppView';

import './styles/general.less';

render(
    <AppView />,
    document.getElementById('app'),
);
