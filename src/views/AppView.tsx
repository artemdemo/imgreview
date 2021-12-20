import React from 'react';
import _ from 'lodash';
import AppVersion from '../components/AppVersion/AppVersion';
import Menu from '../containers/Menu/Menu';
import MobileWarning from '../components/MobileWarning/MobileWarning';
import * as canvasApi from '../../srcCanvas/api';
import '../styles/general.less';

const CanvasContainer = React.lazy(() => import(
  /* webpackChunkName: "CanvasContainer" */
  '../containers/CanvasContainer/CanvasContainer',
));

type TProps = {};

class AppView extends React.PureComponent<TProps> {
  componentDidMount() {
    document.addEventListener('click', this.clickOnBody);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOnBody);
  }

  clickOnBody = (e: any) => {
    const isHtmlEl = _.get(e.target, 'tagName') === 'HTML';
    const isDivApp = e.target && e.target.getAttribute('id') === 'app';
    if (isHtmlEl || isDivApp) {
      canvasApi.blurShapes();
    }
  };

  render() {
    return (
      <>
        <AppVersion />
        <Menu />
        <React.Suspense fallback={null}>
          <CanvasContainer />
        </React.Suspense>
        <MobileWarning />
      </>
    );
  }
}

export default AppView;
