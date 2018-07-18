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
        canvas.setContext(this.canvasRef.current);
        this.handleResize();
    }

    handleResize = () => {
        const { offsetTop } = this.canvasRef.current;
        const windowHeight = window.innerHeight;
        this.setState({
            height: windowHeight - offsetTop,
            width: window.innerWidth,
        });
    };

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                height={this.state.height}
                width={this.state.width}
            />
        );
    }
}

export default CanvasEl;
