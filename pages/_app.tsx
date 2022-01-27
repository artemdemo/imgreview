// I'm not using all bootstrap, only grid and normalizer
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Header } from '../src/containers/Header/Header';
import { AppStateProvider } from '../src/model/AppStateContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppStateProvider>
      <Header />
      <Component {...pageProps} />
    </AppStateProvider>
  );
}

export default MyApp;
