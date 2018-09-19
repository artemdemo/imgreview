import React from 'react';
import Konva from 'konva';
import { connect } from 'react-redux';
import { setStage } from '../../model/canvas/canvasActions';
import {
    blurShapes,
    deleteActiveShape,
    copyActiveShapes,
} from '../../model/shapes/shapesActions';
import Arrow from '../../canvas/Arrow/Arrow';
import { connectArrow } from '../../model/connectShape';

import './CanvasEl.less';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
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

    onKeyDown = (e) => {
        const { deleteActiveShape, copyActiveShapes } = this.props;
        const deleteKeyCodes = [
            8,  // backspace
            46, // delete
        ];

        // Detects that ctrl (or command) is down
        // `metaKey` - is commend (for mac)
        // `ctrlKey` - is commend (for pc)
        const ctrlDown = e.ctrlKey || e.metaKey;

        const isPast = e.keyCode === 86 && ctrlDown; // v
        const isCopy = e.keyCode === 67 && ctrlDown; // c

        switch (true) {
            case deleteKeyCodes.includes(e.keyCode):
                deleteActiveShape();
                break;
            case isCopy:
                copyActiveShapes();
                break;
            case isPast:
                this.handlePasteShapes();
                break;
        }
    };

    handlePasteShapes() {
        const { shapes } = this.props;
        shapes.copiedShapes.forEach((shape) => {
            if (shape instanceof Arrow) {
                // Here I'm copying again (first time was in `shapesReducer`),
                // this way user could paste shape multiple times without collisions
                connectArrow(shape.clone());
            }
        });
    }

    render() {
        const { canvas } = this.props;
        return (
            <div
                ref={this.canvasRef}
                style={{
                    cursor: canvas.cursor,
                }}
                onKeyDown={this.onKeyDown}
                className='canvas-el'
                onClick={this.onClick}
            />
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
