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
import MIFontSize from '../MenuItems/MIFontSize';
import MIGithub from '../MenuItems/MIGithub';
import MIBlankCanvas from '../MenuItems/MIBlankCanvas';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { setMenuHeight, TSetMenuHeight } from '../../model/menu/menuActions';
import * as shapesService from '../../services/shapes'
import { isDev } from '../../services/env';
import * as canvasApi from '../../../srcCanvas/api';
import Separator from '../../components/TopMenu/Separator';

type TProps = {
    canvas: TStateCanvas;
    setMenuHeight: TSetMenuHeight
};

type TState = {
    showStrokeColor: boolean;
    showStrokeWidth: boolean;
};

class Menu extends React.PureComponent<TProps, TState> {
    #menuRef = React.createRef<HTMLDivElement>();
    #unsubShapesBlurred;
    #unsubShapeClicked;
    #unsubShapeAdded;

    state = {
        showStrokeColor: false,
        showStrokeWidth: false,
        showFontSize: false,
    };

    componentDidMount(): void {
        const { setMenuHeight } = this.props;
        const { offsetHeight } = this.#menuRef.current || {};
        if (offsetHeight) {
            setMenuHeight(offsetHeight);
        }

        // @ts-ignore
        this.#unsubShapesBlurred = canvasApi.shapesBlurred.on(this.setItemsVisibility);

        // @ts-ignore
        this.#unsubShapeClicked = canvasApi.shapeClicked.on((shape: any) => {
            requestAnimationFrame(() => this.setItemsVisibility(shape));
        });

        // @ts-ignore
        this.#unsubShapeAdded = canvasApi.shapeAdded.on(this.setItemsVisibility);
    }

    componentWillUnmount(): void {
        this.#unsubShapesBlurred();
        this.#unsubShapeClicked();
        this.#unsubShapeAdded();
    }

    setItemsVisibility = (shape) => {
        const newState = {
            showStrokeColor: false,
            showStrokeWidth: false,
            showFontSize: false,
        };
        if (shape?.type === canvasApi.shapeTypes.ARROW) {
            newState.showStrokeColor = true;
            newState.showStrokeWidth = true;
        }
        if (shape?.type === canvasApi.shapeTypes.TEXT) {
            newState.showStrokeColor = true;
            newState.showFontSize = true;
        }
        this.setState(newState);
    };

    handleMenuClick = () => {
        shapesService.blurShapes();
    };

    render() {
        const { canvas } = this.props;
        const disabled = canvas.height === 0 && canvas.width === 0;
        return (
            <TopMenuPanel
                onClick={this.handleMenuClick}
                ref={this.#menuRef}
            >
                <MIOpenImage />
                <MISave disabled={disabled} />
                <Separator />
                <MIArrow disabled={disabled} />
                <MIText disabled={disabled} />
                <Separator />
                <MIStrokeColor disabled={disabled} show={this.state.showStrokeColor} />
                <MIStrokeWidth disabled={disabled} show={this.state.showStrokeWidth} />
                <MIFontSize disabled={disabled} show={this.state.showFontSize} />
                <Separator show={this.state.showStrokeColor || this.state.showFontSize} />
                <MIResize disabled={disabled} />
                <MIBlankCanvas show={isDev} />
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
