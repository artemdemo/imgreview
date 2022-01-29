import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import { useDevQueries } from '../../services/url';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any) => void;
    isLocalhost: boolean;
  }
}

export const Header: React.FC = () => {
  const { isLocalhost, isDev } = useDevQueries();
  const [attachGaScript, setAttachGaScript] = useState(false);

  useEffect(() => {
    if (!isLocalhost && !window.gtag) {
      setAttachGaScript(true);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'UA-38910005-11');
    }
    window.isLocalhost = isLocalhost;
  }, [isLocalhost, isDev]);

  return (
    <Head>
      <title>ImgReview</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="app-version" content={process.env.appVersion} />
      <meta
        name="description"
        content="App to mark and annotate your images and screenshots."
      />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap"
        rel="stylesheet"
      />

      {attachGaScript && (
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-38910005-11"
        />
      )}
    </Head>
  );
};
