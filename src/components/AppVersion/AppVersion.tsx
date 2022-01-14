import React, { useEffect, useState } from 'react';
import './AppVersion.less';

export const AppVersion: React.FC = () => {
  const [version, setVersion] = useState('x.xx');

  useEffect(() => {
    const appVersionEl = document.querySelector('[name="app-version"]');
    if (appVersionEl) {
      setVersion(appVersionEl.getAttribute('content') || '');
    }
  }, []);

  return <div className="AppVersion">{version}</div>;
};
