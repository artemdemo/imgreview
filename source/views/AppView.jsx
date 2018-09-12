import React from 'react';
import { connect } from 'react-redux';
import MainMenu from '../components/MainMenu/MainMenu';
import DropImage from '../containers/DropImage/DropImage';
import CanvasEl from '../containers/CanvasEl/CanvasEl.async';
import MIOpenImage from '../containers/MenuItems/MIOpenImage';
import MISave from '../containers/MenuItems/MISave';
import MIArrow from '../containers/MenuItems/MIArrow';
import MIStroke from '../containers/MenuItems/MIStroke';
import MIResize from '../containers/MenuItems/MIResize';
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
        if (e.target instanceof HTMLCanvasElement === false) {
            const { blurShapes } = this.props;
            blurShapes();
        }
    };

    render() {
        return (
            <React.Fragment>
                <MainMenu>
                    <MIOpenImage />
                    <MISave />
                    <MIArrow />
                    <MIStroke />
                    <MIResize />
                </MainMenu>
                <DropImage>
                    <CanvasEl />
                </DropImage>
            </React.Fragment>
        );
    }
}

export default connect(
    () => ({}), {
        blurShapes,
    },
)(AppView);
