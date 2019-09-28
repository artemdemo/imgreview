import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import MIOpenImage from '../MenuItems/MIOpenImage';
import MISave from '../MenuItems/MISave';
import MIArrow from '../MenuItems/MIArrow';
import MIStrokeColor from '../MenuItems/MIStrokeColor';
import MIStrokeWidth from '../MenuItems/MIStrokeWidth';
import MIResize from '../MenuItems/MIResize/MIResize';
import MIGithub from '../MenuItems/MIGithub';
import MIBlankCanvas from '../MenuItems/MIBlankCanvas';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import * as shapesService from '../../services/shapes'
import { isDev } from '../../services/env';

type Props = {
    canvas: TStateCanvas;
};

class Menu extends React.PureComponent<Props> {
    onMenuClick = () => {
        shapesService.blurShapes();
    };

    renderBlankCanvas() {
        if (isDev) {
            return (
                <MIBlankCanvas />
            );
        }
        return null;
    }

    render() {
        const { canvas } = this.props;
        const disabled = canvas.imageHeight === 0 && canvas.imageWidth === 0;
        return (
            <TopMenuPanel
                onClick={this.onMenuClick}
            >
                <MIOpenImage />
                <MISave disabled={disabled} />
                <MIArrow disabled={disabled} />
                <MIStrokeColor disabled={disabled} />
                <MIStrokeWidth disabled={disabled} />
                <MIResize disabled={disabled} />
                {this.renderBlankCanvas()}
                <FloatRight>
                    <MIGithub />
                </FloatRight>
            </TopMenuPanel>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
    }),
)(Menu);
