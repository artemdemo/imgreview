import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { AppVersion } from './components/AppVersion/AppVersion';
import { Menu } from './containers/Menu/Menu';
import { MobileWarning } from './components/MobileWarning/MobileWarning';
import { AppStateContext } from './model/AppStateContext';
import { addEventListener, removeEventListener } from './services/document';

const Notifications = dynamic(
  () =>
    import(
      /* webpackChunkName: "Notifications" */
      './containers/Notifications/Notifications'
    ),
  {
    loading: () => (
      <div style={{ position: 'absolute', top: '50px' }}>
        Loading...
      </div>
    ),
  },
);

const CanvasContainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "CanvasContainer" */
      './containers/CanvasContainer/CanvasContainer'
    ),
  { loading: () => null },
);

export const App: React.FC = () => {
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
  } = useContext(AppStateContext);

  useEffect(() => {
    const clickOnBody = (e: any) => {
      const isHtmlEl = _.get(e.target, 'tagName') === 'HTML';
      const isDivApp = e.target && e.target.getAttribute('id') === 'app';
      if (isHtmlEl || isDivApp) {
        canvasApi?.blurShapes();
      }
    };
    addEventListener('click', clickOnBody);
    return () => {
      removeEventListener('click', clickOnBody);
    };
  }, [canvasApi]);

  return (
    <>
      <AppVersion />
      <Menu />
      <CanvasContainer />
      <Notifications />
      <MobileWarning />
    </>
  );
};
