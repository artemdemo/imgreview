import React from 'react';
import * as canvas from '../../canvas/canvas';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        // this.state = {
        //     height: 100,
        //     width: 100,
        // };
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        canvas.init(this.canvasRef.current);
    }

    // handleResize = () => {
    //     const { offsetTop } = this.canvasRef.current;
    //     const windowHeight = window.innerHeight;
    //     this.setState({
    //         height: windowHeight - offsetTop,
    //         width: window.innerWidth,
    //     }, () => {
    //         canvas.init(this.canvasRef.current);
    //     });
    // };

    render() {
        return (
            <div
                ref={this.canvasRef}
            />
        );
    }
}

export default CanvasEl;
