import React from 'react';
import {connect} from 'react-redux';
import {TReduxState} from '../../reducers';
import MIOpenImage from '../MenuItems/MIOpenImage.async';
import MISave from '../MenuItems/MISave';
import MIArrow from '../MenuItems/MIArrow.async';
import MIStrokeColor from '../MenuItems/MIStrokeColor';
import MIStrokeWidth from '../MenuItems/MIStrokeWidth';
import MIResize from '../MenuItems/MIResize/MIResize';
import MIGithub from '../MenuItems/MIGithub';
import MainMenu from '../../components/MainMenu/MainMenu';
import {blurShapes, TBlurShapes} from '../../model/shapes/shapesActions';
import {TStateCanvas} from '../../model/canvas/canvasReducer';

type Props = {
    canvas: TStateCanvas;
    blurShapes: TBlurShapes;
};

class Menu extends React.PureComponent<Props> {
    onMenuClick = () => {
        const { blurShapes } = this.props;
        blurShapes();
    };

    render() {
        const { canvas } = this.props;
        const disabled = canvas.image == null;
        return (
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
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
    }), {
        blurShapes,
    },
)(Menu);
