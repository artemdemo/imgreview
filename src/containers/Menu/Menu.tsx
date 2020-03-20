import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import MIOpenImage from '../MenuItems/MIOpenImage';
import MISave from '../MenuItems/MISave';
import MIArrow from '../MenuItems/MIArrow';
import MIText from '../MenuItems/MIText';
import MIStrokeColor from '../MenuItems/MIStrokeColor';
import MIStrokeWidth from '../MenuItems/MIStrokeWidth';
import MIResize from '../MenuItems/MIResize/MIResize';
import MIGithub from '../MenuItems/MIGithub';
import MIBlankCanvas from '../MenuItems/MIBlankCanvas';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { setMenuHeight, TSetMenuHeight } from '../../model/menu/menuActions';
import * as shapesService from '../../services/shapes'
import { isDev } from '../../services/env';
import * as canvasApi from '../../../srcCanvas/api';

type Props = {
    canvas: TStateCanvas;
    setMenuHeight: TSetMenuHeight
};

class Menu extends React.PureComponent<Props> {
    #menuRef = React.createRef<HTMLDivElement>();

    componentDidMount(): void {
        const { setMenuHeight } = this.props;
        const { offsetHeight } = this.#menuRef.current || {};
        if (offsetHeight) {
            setMenuHeight(offsetHeight);
        }

        // @ts-ignore
        canvasApi.shapesBlurred.on(() => {
            console.log('shapesBlurred');
        });

        // @ts-ignore
        canvasApi.shapeClicked.on((shape) => {
            console.log('shapeClicked', shape);
        });
    }

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
        const disabled = canvas.height === 0 && canvas.width === 0;
        return (
            <TopMenuPanel
                onClick={this.onMenuClick}
                ref={this.#menuRef}
            >
                <MIOpenImage />
                <MISave disabled={disabled} />
                <MIArrow disabled={disabled} />
                <MIText disabled={disabled} />
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
    }), {
        setMenuHeight,
    },
)(Menu);
