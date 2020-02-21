import React from 'react';
import Konva from 'konva';
import { GlobalHotKeys } from 'react-hotkeys';
import {
    blurShapes,
    deleteActiveShape,
} from '../model/shapes/shapesActions';
import * as canvasApi from '../../srcCanvas/api';
import Shape from '../Shape/Shape';
import Arrow from '../Arrow/Arrow';
import { connectArrow } from '../addShape';
import { TCanvasState } from '../reducers';
import canvasStore from '../store';
import { setStage } from '../model/stage/stageActions';
import { ECursorTypes } from '../model/shapes/shapesTypes';
import '../events/events';

import './CanvasEl.less';

/**
 * CanvasEl will be used inside of the main app.
 * Therefore I can't use `connect()` here, since the context will be of the main app and not of the canvas
 */
class CanvasEl extends React.PureComponent {
    static readonly keyMap = {
        'delete': ['backspace', 'delete', 'del'],
        copy: ['ctrl+c', 'command+c'],
        paste: ['ctrl+v', 'command+v'],
    };

    readonly canvasRef = React.createRef<HTMLDivElement>();

    private readonly _keyHandlers: {
        delete: () => void,
        copy: () => void,
        paste: () => void,
    };

    private _copiedShapes: Shape[] = [];

    private storeUnsubscribe: () => void;

    state = {
        width: 0,
        height: 0,
        cursor: ECursorTypes.AUTO,
    };

    constructor(props) {
        super(props);

        this._keyHandlers = {
            'delete': this.onDelete,
            copy: this.onCopy,
            paste: this.onPaste,
        };
    }

    componentDidMount() {
        this.storeUnsubscribe = canvasStore.subscribe(this.handleStoreChange);

        if (this.canvasRef.current) {
            const stage = new Konva.Stage({
                container: this.canvasRef.current,
            });
            const { shapes } = canvasStore.getState() as TCanvasState;
            stage.add(shapes.layer);
            canvasStore.dispatch(setStage(stage));
            this.canvasRef.current.tabIndex = 1;
        }
    }

    componentWillUnmount() {
        this.storeUnsubscribe()
    }

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
    };

    private onCopy = () => {
        const { shapes } = canvasStore.getState() as TCanvasState;
        this._copiedShapes = shapes.list.reduce((acc, shape) => {
            if (shape.isSelected) {
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
        this._copiedShapes.forEach((shape) => {
            if (shape instanceof Arrow) {
                // Here I'm copying again (first time was in `shapesReducer`),
                // this way user could paste shape multiple times without collisions
                connectArrow(shape.clone());
            }
        });
    };

    render() {
        return (
            <GlobalHotKeys
                keyMap={CanvasEl.keyMap}
                handlers={this._keyHandlers}
            >
                <div
                    className="canvas-scroll"
                >
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
            </GlobalHotKeys>
        );
    }
}

// not using `connect()` see reason in the comment before class definition
export default CanvasEl;
