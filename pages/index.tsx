import React from 'react';
import type { NextPage } from 'next';
import { AppView } from '../src/views/AppView';
import { Header } from '../src/containers/Header/Header';
import { AppStateProvider } from '../src/model/AppStateContext';

const Index: NextPage = () => {
  return (
    <>
      <Header />
      <AppStateProvider>
        <AppView />
      </AppStateProvider>
    </>
  )
};

export default Index;
