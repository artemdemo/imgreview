import React from 'react';
import Konva from 'konva/konva';
import { connect } from 'react-redux';
import { setStage, stageClicked } from '../../model/canvas/canvasActions';

import './CanvasEl.less';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const { setStage, stageClicked } = this.props;
        const stage = new Konva.Stage({
            container: this.canvasRef.current,
        });
        setStage(stage);
        stage.on('click', () => {
            stageClicked();
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
        stageClicked,
    }
)(CanvasEl);
