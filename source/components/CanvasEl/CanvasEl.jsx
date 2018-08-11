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
        return (
            <div
                ref={this.canvasRef}
                className='canvas-el'
            />
        );
    }
}

export default connect(
    () => ({}), {
        setStage,
        blurShapes,
    }
)(CanvasEl);
