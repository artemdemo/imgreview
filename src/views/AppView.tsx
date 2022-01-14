import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import { AppVersion } from '../components/AppVersion/AppVersion';
import { Menu } from '../containers/Menu/Menu';
import MobileWarning from '../components/MobileWarning/MobileWarning';
import { Suspense } from '../components/Suspense/Suspense';
import '../styles/general.less';
import { AppStateContext } from '../model/AppStateContext';

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

  const clickOnBody = (e: any) => {
    const isHtmlEl = _.get(e.target, 'tagName') === 'HTML';
    const isDivApp = e.target && e.target.getAttribute('id') === 'app';
    if (isHtmlEl || isDivApp) {
      canvasApi?.blurShapes();
    }
  };

  useEffect(() => {
    document.addEventListener('click', clickOnBody);
    return () => {
      document.removeEventListener('click', clickOnBody);
    };
  }, []);

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
