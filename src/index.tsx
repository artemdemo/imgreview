import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as doc from './services/document';
import { AppView } from './views/AppView';
import { AppStateProvider } from './model/AppStateContext';
import { Suspense } from './components/Suspense/Suspense';

const AboutView = React.lazy(() =>
  import(
    /* webpackChunkName: "AboutView" */
    './views/AboutView'
  ),
);

export const App = () => (
  <AppStateProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AppView />} />
        <Route
          path="/about"
          element={
            <Suspense>
              <AboutView />
            </Suspense>
          }
        />
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
