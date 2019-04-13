import React from 'react';
import Konva from 'konva';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import { setStage } from '../../model/canvas/canvasActions';
import {
    blurShapes,
    deleteActiveShape,
    copyActiveShapes,
} from '../../model/shapes/shapesActions';
import Arrow from '../Arrow/Arrow';
import { connectArrow } from '../connectShape';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TStateShapes } from '../../model/shapes/shapesReducer';
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

    private readonly canvasRef = React.createRef<HTMLDivElement>();

    private readonly keyHandlers: {
        delete: () => void,
        copy: () => void,
        paste: () => void,
    };

    constructor(props) {
        super(props);

        this.keyHandlers = {
            'delete': this.onDelete,
            copy: this.onCopy,
            paste: this.onPaste,
        };
    }

    componentDidMount() {
        const { setStage } = this.props;
        const stage = new Konva.Stage({
            container: this.canvasRef.current,
        });
        setStage(stage);
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
        const { copyActiveShapes } = this.props;
        copyActiveShapes();
    };

    onPaste = () => {
        const { shapes } = this.props;
        shapes.copiedShapes.forEach((shape) => {
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
                handlers={this.keyHandlers}
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
        setStage,
        blurShapes,
        deleteActiveShape,
        copyActiveShapes,
    }
)(CanvasEl);
