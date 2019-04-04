import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import { TReduxState } from '../reducers';
import MainMenu from '../components/MainMenu/MainMenu';
import AppVersion from '../components/AppVersion/AppVersion';
import CanvasContainer from '../containers/CanvasContainer/CanvasContainer.async';
import MIOpenImage from '../containers/MenuItems/MIOpenImage.async';
import MISave from '../containers/MenuItems/MISave';
import MIArrow from '../containers/MenuItems/MIArrow.async';
import MIGithub from '../containers/MenuItems/MIGithub';
import MIStrokeColor from '../containers/MenuItems/MIStrokeColor';
import MIStrokeWidth from '../containers/MenuItems/MIStrokeWidth';
import MIResize from '../containers/MenuItems/MIResize/MIResize';
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

    onMenuClick = () => {
        const { blurShapes } = this.props;
        blurShapes();
    };

    render() {
        const { canvas } = this.props;
        const disabled = canvas.image == null;
        return (
            <React.Fragment>
                <AppVersion />
                <MainMenu
                    onClick={this.onMenuClick}
                >
                    <MIOpenImage />
                    <MISave disabled={disabled} />
                    <MIArrow disabled={disabled} />
                    <MIStrokeColor disabled={disabled} />
                    <MIStrokeWidth disabled={disabled} />
                    <MIResize disabled={disabled} />
                    <MIGithub />
                </MainMenu>
                {/*<CanvasContainer />*/}
            </React.Fragment>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
    }), {
        blurShapes,
    },
)(AppView);
