import React from 'react';
import type { NextPage } from 'next';
import { App } from '../src/App';
import { Header } from '../src/containers/Header/Header';
import { AppStateProvider } from '../src/model/AppStateContext';

const Index: NextPage = () => {
  return (
    <>
      <Header />
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </>
  );
};

export default Index;
