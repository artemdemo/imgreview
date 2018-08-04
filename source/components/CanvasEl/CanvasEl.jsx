import React from 'react';
import { connect } from 'react-redux';
import { setContainer } from '../../model/canvas/canvasActions';

class CanvasEl extends React.PureComponent {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const { setContainer } = this.props;
        setContainer(this.canvasRef.current);
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
        setContainer,
    }
)(CanvasEl);
