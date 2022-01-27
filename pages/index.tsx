import React from 'react';
import type { NextPage } from 'next';
import { App } from '../src/App';
import { AppStateProvider } from '../src/model/AppStateContext';

const Index: NextPage = () => {
  return (
    <>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </>
  );
};

export default Index;
