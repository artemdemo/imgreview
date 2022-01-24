import React, { useEffect, useState } from 'react';
import s from './AppVersion.module.css';

export const AppVersion: React.FC = () => {
  const [version, setVersion] = useState<string>('x.xx');

  useEffect(() => {
    try {
      if (process.env.appVersion) {
        setVersion(process.env.appVersion);
      }
    } catch (e) {}
  }, []);

  return <div className={s.AppVersion}>{version}</div>;
};
