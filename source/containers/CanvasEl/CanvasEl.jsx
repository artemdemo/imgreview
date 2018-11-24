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
import Arrow from '../../canvas/Arrow/Arrow';
import { connectArrow } from '../../model/connectShape';

import './CanvasEl.less';

const keyMap = {
    'delete': ['backspace', 'delete'],
    copy: ['ctrl+c', 'command+c'],
    paste: ['ctrl+v', 'command+v'],
};

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();

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
        this.canvasRef.current.tabIndex = 1;
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
                keyMap={keyMap}
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
    state => ({
        canvas: state.canvas,
        shapes: state.shapes,
    }), {
        setStage,
        blurShapes,
        deleteActiveShape,
        copyActiveShapes,
    }
)(CanvasEl);
