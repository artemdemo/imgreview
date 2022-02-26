import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useDevQueries } from '../../services/url';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any) => void;
    isLocalhost: boolean | undefined;
  }
}

export const Header: React.FC = () => {
  const { isLocalhost, isDev } = useDevQueries();
  const [attachGaScript, setAttachGaScript] = useState(false);

  useEffect(() => {
    if (isLocalhost === false && !window.gtag) {
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
      {attachGaScript && (
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-38910005-11"
        />
      )}
    </Head>
  );
};
