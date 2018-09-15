import React from 'react';
import Konva from 'konva';
import { connect } from 'react-redux';
import { setStage } from '../../model/canvas/canvasActions';
import { blurShapes, deleteActiveShape } from '../../model/shapes/shapesActions';

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
        const { deleteActiveShape } = this.props;
        const deleteKeyCodes = [
            8, // backspace
            46, // delete
        ];
        if (deleteKeyCodes.includes(e.keyCode)) {
            deleteActiveShape();
        }
    };

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
    }), {
        setStage,
        blurShapes,
        deleteActiveShape,
    }
)(CanvasEl);
