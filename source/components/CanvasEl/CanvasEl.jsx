import React from 'react';
import Konva from 'konva/konva';
import { connect } from 'react-redux';
import { setStage } from '../../model/canvas/canvasActions';

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
        stage.on('click', () => {
            console.log('stage clicked');
        });
    }

    render() {
        return (
            <div
                ref={this.canvasRef}
            />
        );
    }
}

export default connect(
    () => ({}), {
        setStage,
    }
)(CanvasEl);
