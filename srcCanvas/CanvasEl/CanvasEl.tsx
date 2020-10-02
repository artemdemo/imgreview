import React from 'react';
import Konva, {TPos} from 'konva';
import { GlobalHotKeys } from 'react-hotkeys';
import {
    blurShapes,
    deleteActiveShapes,
    setCursor,
    setAddingShape,
    drawLayers,
    deleteShape,
} from '../model/shapes/shapesActions';
import * as canvasApi from '../../srcCanvas/api';
import {
    connectShape,
    cloneAndConnectShape,
} from '../addShape';
import Shape from '../Shape/Shape';
import { TCanvasState } from '../reducers';
import canvasStore from '../store';
import { setStage } from '../model/stage/stageActions';
import { ECursorTypes } from '../model/shapes/shapesModelTypes';
import * as clipboard from '../services/clipboard';
import {SHAPES_LAYER_CLS, ANCHORS_LAYER_CLS, IMAGE_LAYER_CLS} from '../model/shapes/shapesConst';
import '../events/events';
import './CanvasEl.less';

type TProps = {};

type TState = {
    width: number;
    height: number;
    cursor: ECursorTypes;
    mouseIsDown: boolean;
    mouseStartPos: TPos;
};

export const getShapesLayerEl = (): HTMLCanvasElement => {
    const shapesLayerEl: HTMLCanvasElement|null = document.querySelector(`.${SHAPES_LAYER_CLS}`);
    if (shapesLayerEl) {
        return shapesLayerEl;
    }
    throw new Error(`Shapes layer is not found`);
};

/**
 * CanvasEl will be used inside of the main app.
 * Therefore I can't use `connect()` here, since the context will be of the main app and not of the canvas.
 */
class CanvasEl extends React.PureComponent<TProps, TState> {
    static readonly keyMap = {
        'delete': ['backspace', 'delete', 'del'],
        copy: ['ctrl+c', 'command+c'],
        paste: ['ctrl+v', 'command+v'],
    };

    readonly canvasRef = React.createRef<HTMLDivElement>();

    readonly #keyHandlers: {
        delete: () => void,
        copy: () => void,
        paste: (event: any) => void,
    };

    #copiedShapes: any[] = [];

    #storeUnsubscribe: () => void;

    state = {
        width: 0,
        height: 0,
        // Cursor is changed based on component state and not the global one,
        // since CanvasEl can't be connected, I can only subscribe to the changes in canvas global state.
        // Therefore I can't simply take mapped global state from the props.
        cursor: ECursorTypes.AUTO,
        mouseIsDown: false,
        mouseStartPos: { x: 0, y: 0 },
    };

    constructor(props) {
        super(props);

        this.#keyHandlers = {
            'delete': this.onDelete,
            copy: this.onCopy,
            paste: this.onPaste,
        };
    }

    componentDidMount() {
        this.#storeUnsubscribe = canvasStore.subscribe(this.handleStoreChange);

        if (this.canvasRef.current) {
            const stage = new Konva.Stage({
                container: this.canvasRef.current,
            });
            const { shapes, image } = canvasStore.getState() as TCanvasState;
            stage.add(image.layer);
            stage.add(shapes.shapesLayer);
            stage.add(shapes.anchorsLayer);
            try {
                image.layer.getCanvas()._canvas.classList.add(IMAGE_LAYER_CLS);
                shapes.shapesLayer.getCanvas()._canvas.classList.add(SHAPES_LAYER_CLS);
                shapes.anchorsLayer.getCanvas()._canvas.classList.add(ANCHORS_LAYER_CLS);
            } catch (e) {
                console.error('Can\'t set className to the canvas');
                console.error(e);
            }
            stage.on('mousedown', this.handleStageOnMouseDown);
            stage.on('mouseup', this.handleStageOnMouseUp);
            stage.on('mousemove', this.handleStageOnMouseMove);
            canvasStore.dispatch(setStage(stage));
            this.canvasRef.current.tabIndex = 1;
        }
    }

    componentWillUnmount() {
        this.#storeUnsubscribe()
    }

    private handleStageOnMouseDown = (e) => {
        const { shapes } = canvasStore.getState() as TCanvasState;
        if (shapes.addingShapeRef) {
            const { layerX, layerY } = e.evt;
            const mouseStartPos = {
                x: layerX,
                y: layerY,
            };
            this.setState({
                mouseIsDown: true,
                mouseStartPos,
            });
            connectShape(shapes.addingShapeRef);
            shapes.addingShapeRef.initDraw(mouseStartPos, mouseStartPos);
        }
    };

    private handleStageOnMouseUp = (e) => {
        this.setState({ mouseIsDown: false });
        const { shapes } = canvasStore.getState() as TCanvasState;
        if (shapes.addingShapeRef) {
            canvasApi.shapeAdded(shapes.addingShapeRef);
            shapes.addingShapeRef.focus();
        }
        canvasStore.dispatch(setAddingShape(null));
        // I need to redraw shapes in order to focus to take effect.
        canvasStore.dispatch(drawLayers());
    };

    private handleStageOnMouseMove = (e) => {
        const { shapes } = canvasStore.getState() as TCanvasState;
        if (this.state.mouseIsDown && shapes.addingShapeRef) {
            const { layerX, layerY } = e.evt;
            shapes.addingShapeRef.initDraw(this.state.mouseStartPos, {x: layerX, y: layerY});
        }
    };

    private handleStoreChange = () => {
        const { shapes, stage } = canvasStore.getState() as TCanvasState;
        if (!stage.instance) {
            throw new Error(`"instance" is not defined on stage. It looks like stage is not defined yet.`);
        }
        const { width, height } = stage.instance.getAttrs();
        this.setState({
            width,
            height,
            cursor: shapes.cursor,
        })
    };

    private onClick = (e) => {
        if (this.canvasRef.current === e.target) {
            canvasStore.dispatch(blurShapes());
        }
    };

    private onDelete = () => {
        canvasStore.dispatch(deleteActiveShapes());
        // In case users cursor is on the shape that is being deleted.
        // I need to remove cursor styling from the parent.
        canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
    };

    private onCopy = () => {
        const { shapes } = canvasStore.getState() as TCanvasState;

        // Here I'm coping a dummy text into the clipboard.
        // This is workaround for case when user has image in the clipboard.
        // In this scenario after copying a shape and pasting it - image will appear and override everything.
        // ToDo: Copy image of the shape into the clipboard.
        //       This approach will be much better experience.
        clipboard.copyToClipboard('[Shape]');

        this.#copiedShapes = shapes.list.reduce((acc, shape) => {
            if (shape.isSelected()) {
                return [
                    ...acc,
                    // I need to clone here,
                    // so copied shape will keep exact coordinates of the moment of copying
                    shape.clone(),
                ];
            }
            return acc;
        }, []);
    };

    // This `onPaste` function is only meant to be used to paste shapes.
    // Image paste is handled by `CanvasContainer`, `DropImage`
    private onPaste = () => {
        canvasApi.blurShapes();
        this.#copiedShapes.forEach((shape: Shape) => {
            cloneAndConnectShape(shape);
        });
    };

    render() {
        return (
            <div className="canvas-scroll">
                <GlobalHotKeys
                    keyMap={CanvasEl.keyMap}
                    handlers={this.#keyHandlers}
                />
                <div
                    className="canvas-container"
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                    }}
                >
                    <div
                        ref={this.canvasRef}
                        style={{
                            cursor: this.state.cursor,
                        }}
                        className="canvas-el"
                        onClick={this.onClick}
                    />
                </div>
            </div>
        );
    }
}

// not using `connect()` see reason in the comment before class definition
export default CanvasEl;
