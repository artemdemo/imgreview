import React from 'react';
import Head from 'next/head';
import { isDev } from '../../services/env';

declare global {
  interface Window { dataLayer: any[]; }
}

if (!isDev) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', 'UA-38910005-11');
  } catch (e) {}
}

export const Header: React.FC = () => {
  return (
    <Head>
      <title>ImgReview</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="app-version" content={process.env.appVersion} />
      <meta name="description" content="App to mark and annotate your images and screenshots." />
      <link rel="icon" type="image/x-icon" href="./favicon.ico" />
      <link rel="icon" type="image/png" href="./favicon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap" rel="stylesheet" />

      {!isDev && (
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-38910005-11" />
      )}
    </Head>
  );
};
