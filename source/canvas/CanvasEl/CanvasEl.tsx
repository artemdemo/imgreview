import React from 'react';
import Konva from 'konva';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import {
    blurShapes,
    deleteActiveShape,
} from '../../model/shapes/shapesActions';
import Shape from '../Shape/Shape';
import Arrow from '../Arrow/Arrow';
import { connectArrow } from '../addShape';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TStateShapes } from '../../model/shapes/shapesReducer';
import store from '../store';
import { setStage } from '../model/stage/stageActions';
import '../events/events';

import './CanvasEl.less';

type Props = {
    canvas: TStateCanvas;
    shapes: TStateShapes;
    setStage: (stage: any) => void;
    blurShapes: () => void;
    deleteActiveShape: () => void;
    copyActiveShapes: () => void;
};

class CanvasEl extends React.PureComponent<Props> {
    static readonly keyMap = {
        'delete': ['backspace', 'delete', 'del'],
        copy: ['ctrl+c', 'command+c'],
        paste: ['ctrl+v', 'command+v'],
    };

    static stage: any = null;

    readonly canvasRef = React.createRef<HTMLDivElement>();

    private readonly _keyHandlers: {
        delete: () => void,
        copy: () => void,
        paste: () => void,
    };

    private _copiedShapes: Shape[];

    constructor(props) {
        super(props);

        this._keyHandlers = {
            'delete': this.onDelete,
            copy: this.onCopy,
            paste: this.onPaste,
        };
    }

    componentDidMount() {
        const stage = new Konva.Stage({
            container: this.canvasRef.current,
        });
        store.dispatch(setStage(stage));

        if (this.canvasRef.current) {
            this.canvasRef.current.tabIndex = 1;
        }
    }

    onClick = (e) => {
        const { blurShapes } = this.props;
        if (this.canvasRef.current === e.target) {
            blurShapes();
        }
    };

    onDelete = () => {
        const { deleteActiveShape } = this.props;
        deleteActiveShape();
    };

    onCopy = () => {
        const { shapes } = this.props;
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

    onPaste = () => {
        this._copiedShapes.forEach((shape) => {
            if (shape instanceof Arrow) {
                // Here I'm copying again (first time was in `shapesReducer`),
                // this way user could paste shape multiple times without collisions
                connectArrow(shape.clone());
            }
        });
    };

    render() {
        const { canvas } = this.props;
        return (
            <HotKeys
                keyMap={CanvasEl.keyMap}
                handlers={this._keyHandlers}
            >
                <div
                    ref={this.canvasRef}
                    style={{
                        cursor: canvas.cursor,
                    }}
                    className='canvas-el'
                    onClick={this.onClick}
                />
            </HotKeys>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
        shapes: state.shapes,
    }), {
        blurShapes,
        deleteActiveShape,
    }
)(CanvasEl);
