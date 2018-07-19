import React from 'react';
import * as canvas from '../../canvas/canvas';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            height: 100,
            width: 100,
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.handleResize();
    }

    handleResize = () => {
        const { offsetTop } = this.canvasRef.current;
        const windowHeight = window.innerHeight;
        this.setState({
            height: windowHeight - offsetTop,
            width: window.innerWidth,
        }, () => {
            canvas.setStage(
                this.canvasRef.current,
                this.state.width,
                this.state.height,
            );
        });
    };

    render() {
        return (
            <div
                ref={this.canvasRef}
            />
        );
    }
}

export default CanvasEl;
