// I'm not using all bootstrap, only grid and normalizer
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Header } from '../src/containers/Header/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
