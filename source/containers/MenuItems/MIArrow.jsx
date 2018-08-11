import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import Arrow from '../../canvas/Arrow/Arrow';
import { addArrow } from '../../model/shapes/shapesActions';

class MIArrow extends React.PureComponent {
    onClick = () => {
        const { shapes, canvas, addArrow } = this.props;
        const arrow = new Arrow({
            stroke: shapes.stroke,
            strokeWidth: shapes.strokeWidth,
        });
        arrow.addToStage(canvas.stage);
        addArrow(arrow);
    };

    render() {
        const { canvas } = this.props;
        return (
            <MainMenuItem
                onClick={this.onClick}
                disabled={canvas.image == null}
            >
                <Icon name='mouse-pointer' />
            </MainMenuItem>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
        shapes: state.shapes,
    }),
    {
        addArrow,
    }
)(MIArrow);
