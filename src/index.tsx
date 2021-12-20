import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as doc from './services/document';
import store from './store';
import { AppView } from './views/AppView';
import { AboutView } from './views/AboutView';

export const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<AppView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </Router>
  </Provider>
);

const rootElement = doc.getElementById('app');

if (rootElement!.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
