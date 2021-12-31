import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as doc from './services/document';
import { AppView } from './views/AppView';
import { AboutView } from './views/AboutView';
import { AppStateProvider } from './model/AppStateContext';

export const App = () => (
  <AppStateProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AppView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </Router>
  </AppStateProvider>
);

const rootElement = doc.getElementById('app');

if (rootElement!.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
