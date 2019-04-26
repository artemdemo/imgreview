import React from 'react';
import _get from 'lodash/get';
import AppVersion from '../components/AppVersion/AppVersion';
import CanvasContainer from '../containers/CanvasContainer/CanvasContainer.async';
import Menu from '../containers/Menu/Menu';
import { TStateCanvas } from '../model/canvas/canvasReducer';
import * as canvasApi from '../canvas/api';

import '../styles/general.less';

type Props = {
    canvas: TStateCanvas;
};

class AppView extends React.PureComponent<Props> {
    componentDidMount() {
        document.addEventListener('click', this.clickOnBody);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.clickOnBody);
    }

    clickOnBody = (e) => {
        const isHtmlEl = _get(e.target, 'tagName') === 'HTML';
        const isDivApp = e.target && e.target.getAttribute('id') === 'app';
        if (isHtmlEl || isDivApp) {
            canvasApi.blurShapes();
        }
    };

    render() {
        return (
            <React.Fragment>
                <AppVersion />
                <Menu />
                <CanvasContainer />
            </React.Fragment>
        );
    }
}

export default AppView;
