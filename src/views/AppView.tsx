import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import { AppVersion } from '../components/AppVersion/AppVersion';
import { Menu } from '../containers/Menu/Menu';
import { MobileWarning } from '../components/MobileWarning/MobileWarning';
import { Suspense } from '../components/Suspense/Suspense';
import { AppStateContext } from '../model/AppStateContext';
// I'm not using all bootstrap, only grid and normalizer
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import '../styles/general.css';

const Notifications = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Notifications" */
      '../containers/Notifications/Notifications'
    ),
);

const CanvasContainer = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CanvasContainer" */
      '../containers/CanvasContainer/CanvasContainer'
    ),
);

export const AppView: React.FC = () => {
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
    document.addEventListener('click', clickOnBody);
    return () => {
      document.removeEventListener('click', clickOnBody);
    };
  }, [canvasApi]);

  return (
    <>
      <AppVersion />
      <Menu />
      <Suspense
        fallback={
          <div style={{ position: 'absolute', top: menu.menuHeight }}>
            Loading...
          </div>
        }
      >
        <CanvasContainer />
      </Suspense>
      <Suspense>
        <Notifications />
      </Suspense>
      <MobileWarning />
    </>
  );
};
