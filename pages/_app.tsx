// I'm not using all bootstrap, only grid and normalizer
import '../styles/bootstrap-reboot.min.css';
import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { Header } from '../src/containers/Header/Header';
import { AppStateProvider } from '../src/model/AppStateContext';
import { Menu } from '../src/containers/Menu/Menu';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppStateProvider>
      <Header />
      <Menu />
      <Component {...pageProps} />
    </AppStateProvider>
  );
}

export default MyApp;
