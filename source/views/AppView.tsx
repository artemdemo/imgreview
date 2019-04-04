import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import AppVersion from '../components/AppVersion/AppVersion';
import CanvasContainer from '../containers/CanvasContainer/CanvasContainer.async';
import Menu from '../containers/Menu/Menu';
import { TBlurShapes, blurShapes } from '../model/shapes/shapesActions';
import { TStateCanvas } from '../model/canvas/canvasReducer';

type Props = {
    canvas: TStateCanvas;
    blurShapes: TBlurShapes;
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
            const { blurShapes } = this.props;
            blurShapes();
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

export default connect(
    () => ({}),
    {
        blurShapes,
    },
)(AppView);
