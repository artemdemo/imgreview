import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import MainMenu from '../components/MainMenu/MainMenu';
import AppVersion from '../components/AppVersion/AppVersion';
import CanvasContainer from '../containers/CanvasContainer/CanvasContainer.async';
import MIOpenImage from '../containers/MenuItems/MIOpenImage.async';
import MISave from '../containers/MenuItems/MISave';
import MIArrow from '../containers/MenuItems/MIArrow.async';
import MIGithub from '../containers/MenuItems/MIGithub';
import MIStrokeColor from '../containers/MenuItems/MIStrokeColor';
import MIResize from '../containers/MenuItems/MIResize/MIResize';
import {
    blurShapes,
} from '../model/shapes/shapesActions';

class AppView extends React.PureComponent {
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
        return (
            <React.Fragment>
                <AppVersion />
                <MainMenu
                    onClick={this.onMenuClick}
                >
                    <MIOpenImage />
                    <MISave />
                    <MIArrow />
                    <MIStrokeColor />
                    <MIResize />
                    <MIGithub />
                </MainMenu>
                <CanvasContainer />
            </React.Fragment>
        );
    }
}

export default connect(
    () => ({}), {
        blurShapes,
    },
)(AppView);
