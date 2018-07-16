import React from 'react';
import _debounce from 'lodash/debounce';

import './Canvas.less';

class Canvas extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            height: 100,
        };
        this.canvasRef = React.createRef();
        this.onResize = _debounce(this.handleResize, 100);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    handleResize = () => {
        const { offsetTop } = this.canvasRef.current;
        const windowHeight = window.innerHeight;
        this.setState({
            height: windowHeight - offsetTop,
        });
    };

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                style={{height: this.state.height}}
                className='canvas'
            />
        );
    }
}

export default Canvas;
