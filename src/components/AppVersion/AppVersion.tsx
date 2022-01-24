import React, { useEffect, useState } from 'react';
import { querySelector } from '../../services/document';
import s from './AppVersion.module.css';

export const AppVersion: React.FC = () => {
  const [version, setVersion] = useState('x.xx');

  useEffect(() => {
    const appVersionEl = querySelector('[name="app-version"]');
    if (appVersionEl) {
      setVersion(appVersionEl.getAttribute('content') || '');
    }
  }, []);

  return <div className={s.AppVersion}>{version}</div>;
};
