import React from "react";
import Konva from "konva";
import { GlobalHotKeys } from "react-hotkeys";
import {
    blurShapes,
    deleteActiveShape,
    setCursor,
} from "../model/shapes/shapesActions";
import * as canvasApi from "../../srcCanvas/api";
import Arrow from "../Arrow/Arrow";
import Text from "../Text/Text";
import {connectArrow, connectText, connectRect} from "../addShape";
import { TCanvasState } from "../reducers";
import canvasStore from "../store";
import { setStage } from "../model/stage/stageActions";
import { ECursorTypes } from "../model/shapes/shapesTypes";
import "../events/events";

import "./CanvasEl.less";
import Rect from "../Rect/Rect";
import Shape from "../Shape/Shape";

/**
 * CanvasEl will be used inside of the main app.
 * Therefore I can't use `connect()` here, since the context will be of the main app and not of the canvas.
 */
class CanvasEl extends React.PureComponent {
    static readonly keyMap = {
        'delete': ['backspace', 'delete', 'del'],
        copy: ['ctrl+c', 'command+c'],
        paste: ['ctrl+v', 'command+v'],
    };

    readonly canvasRef = React.createRef<HTMLDivElement>();

    readonly #keyHandlers: {
        delete: () => void,
        copy: () => void,
        paste: () => void,
    };

    #copiedShapes: any[] = [];

    #storeUnsubscribe: () => void;

    state = {
        width: 0,
        height: 0,
        cursor: ECursorTypes.AUTO,
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
            const { shapes } = canvasStore.getState() as TCanvasState;
            stage.add(shapes.layer);
            stage.on('click', this.handleStageClicked);
            canvasStore.dispatch(setStage(stage));
            this.canvasRef.current.tabIndex = 1;
        }
    }

    componentWillUnmount() {
        this.#storeUnsubscribe()
    }

    private handleStageClicked = () => {
        canvasStore.dispatch(blurShapes());
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
        canvasStore.dispatch(deleteActiveShape());
        // In case users cursor is on the shape that is being deleted.
        // I need to remove cursor styling from the parent.
        canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
    };

    private onCopy = () => {
        const { shapes } = canvasStore.getState() as TCanvasState;
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

    private onPaste = () => {
        canvasApi.blurShapes();
        this.#copiedShapes.forEach((shape: Shape) => {
            if (shape instanceof Arrow) {
                // Here I'm copying again (first time was in `shapesReducer`),
                // this way user could paste shape multiple times without collisions
                connectArrow(shape.clone());
            } else if (shape instanceof Text) {
                connectText(shape.clone())
            } else if (shape instanceof Rect) {
                connectRect(shape.clone())
            } else {
                console.error('Given shape doesn\'t have connect() function');
                console.log(shape);
            }
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
