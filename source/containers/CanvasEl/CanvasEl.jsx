import React from 'react';
import Konva from 'konva';
import { connect } from 'react-redux';
import { setStage } from '../../model/canvas/canvasActions';
import { blurShapes } from '../../model/shapes/shapesActions';

import './CanvasEl.less';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const { setStage, blurShapes } = this.props;
        const stage = new Konva.Stage({
            container: this.canvasRef.current,
        });
        setStage(stage);
        stage.on('click', () => {
            blurShapes();
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
                className='canvas-el'
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
    }
)(CanvasEl);
