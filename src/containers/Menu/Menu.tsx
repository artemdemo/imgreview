import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import MIOpenImage from '../MenuItems/MIOpenImage';
import MISave from '../MenuItems/MISave';
import MICopyAll from '../MenuItems/MICopyAll';
import MIArrow from '../MenuItems/MIArrow';
import MIText from '../MenuItems/MIText';
import MICrop from '../MenuItems/MICrop';
import MISelect from '../MenuItems/MISelect';
import MIRect from '../MenuItems/MIRect';
import MICircle from '../MenuItems/MIEllipse';
import MISketchify from '../MenuItems/MISketchify';
import MIStrokeColor from '../MenuItems/MIStrokeColor';
import MIStrokeWidth from '../MenuItems/MIStrokeWidth';
import MIResize from '../MenuItems/MIResize/MIResize';
import MIFontSize from '../MenuItems/MIFontSize';
import MIGithub from '../MenuItems/MIGithub';
import MIBlankCanvas from '../MenuItems/MIBlankCanvas';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { setMenuHeight, TSetMenuHeight, setShapeToAdd, TSetShapeToAdd } from '../../model/menu/menuActions';
import { isDev } from '../../services/env';
import * as canvasApi from '../../../srcCanvas/api';
import Separator from '../../components/TopMenu/Separator';
import {TShapesBlurred} from '../../../srcCanvas/api';

type TProps = {
    canvas: TStateCanvas;
    setMenuHeight: TSetMenuHeight;
    setShapeToAdd: TSetShapeToAdd;
};

type TState = {
    showStrokeColor: boolean;
    showStrokeWidth: boolean;
    showSketchify: boolean;
};

class Menu extends React.PureComponent<TProps, TState> {
    #menuRef = React.createRef<HTMLDivElement>();
    #unsubShapesBlurred;
    #unsubShapeClicked;
    #unsubShapeAdded;

    state = {
        showStrokeColor: false,
        showStrokeWidth: false,
        showSketchify: false,
        showCrop: false,
        showFontSize: false,
    };

    componentDidMount(): void {
        const { setMenuHeight } = this.props;
        const { offsetHeight } = this.#menuRef.current || {};
        if (offsetHeight) {
            setMenuHeight(offsetHeight);
        }

        this.#unsubShapesBlurred = canvasApi.shapesBlurred.on(this.setItemsVisibility);

        this.#unsubShapeClicked = canvasApi.shapeClicked.on((shape: canvasApi.TShapeClicked) => {
            requestAnimationFrame(() => this.setItemsVisibility(shape));
        });

        this.#unsubShapeAdded = canvasApi.shapeAdded.on((shape: canvasApi.TShapeAdded) => {
            this.setItemsVisibility(shape);
        });
    }

    componentWillUnmount(): void {
        this.#unsubShapesBlurred();
        this.#unsubShapeClicked();
        this.#unsubShapeAdded();
    }

    setItemsVisibility = (shape: canvasApi.TShapesBlurred) => {
        const { setShapeToAdd } = this.props;
        setShapeToAdd();

        const newState = {
            showStrokeColor: false,
            showStrokeWidth: false,
            showSketchify: false,
            showCrop: false,
            showFontSize: false,
        };
        switch (shape?.type) {
            case canvasApi.EShapeTypes.RECT:
            case canvasApi.EShapeTypes.ELLIPSE:
                newState.showStrokeColor = true;
                newState.showStrokeWidth = true;
                newState.showSketchify = true;
                break;
            case canvasApi.EShapeTypes.ARROW:
                newState.showStrokeColor = true;
                newState.showStrokeWidth = true;
                newState.showSketchify = true;
                break;
            case canvasApi.EShapeTypes.TEXT:
                newState.showStrokeColor = true;
                newState.showFontSize = true;
                break;
            case canvasApi.EShapeTypes.SELECT_RECT:
                newState.showCrop = true;
                break;
        }
        this.setState(newState);
    };

    handleMenuClick = () => {
        canvasApi.blurShapes();
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
                <MICopyAll disabled={disabled} />
                <Separator />
                <MIArrow disabled={disabled} />
                <MIText disabled={disabled} />
                <MISelect disabled={disabled} />
                <MIRect disabled={disabled} />
                <MICircle disabled={disabled} />
                <Separator />
                <MICrop disabled={disabled} show={this.state.showCrop} />
                <MIStrokeColor disabled={disabled} show={this.state.showStrokeColor} />
                <MIStrokeWidth disabled={disabled} show={this.state.showStrokeWidth} />
                <MIFontSize disabled={disabled} show={this.state.showFontSize} />
                <MISketchify disabled={disabled} show={this.state.showSketchify} />
                <Separator show={this.state.showStrokeColor || this.state.showFontSize || this.state.showCrop} />
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
        setShapeToAdd,
    },
)(Menu);
