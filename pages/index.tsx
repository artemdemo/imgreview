import React, { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { AppStateContext } from '../src/model/AppStateContext';
import _ from 'lodash';
import {
  addEventListener,
  removeEventListener,
} from '../src/services/document';
import { AppVersion } from '../src/components/AppVersion/AppVersion';
import { MobileWarning } from '../src/components/MobileWarning/MobileWarning';
import dynamic from 'next/dynamic';

const Notifications = dynamic(
  () =>
    import(
      /* webpackChunkName: "Notifications" */
      '../src/containers/Notifications/Notifications'
    ),
  {
    loading: () => (
      <div style={{ position: 'absolute', top: '50px' }}>Loading...</div>
    ),
  },
);

const CanvasContainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "CanvasContainer" */
      '../src/containers/CanvasContainer/CanvasContainer'
    ),
  { loading: () => null },
);

const Index: NextPage = () => {
  const {
    state: {
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
      <CanvasContainer />
      <Notifications />
      <MobileWarning />
    </>
  );
};

export default Index;
