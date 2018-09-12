import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import Arrow from '../../canvas/Arrow/Arrow';
import { addArrow, blurShapes } from '../../model/shapes/shapesActions';
import { setCursor } from '../../model/canvas/canvasActions';
import { cursorTypes } from '../../model/canvas/canvasConst';

class MIArrow extends React.PureComponent {
    onClick = () => {
        const { shapes, canvas, addArrow, blurShapes, setCursor } = this.props;
        const arrow = new Arrow({
            stroke: shapes.stroke,
            strokeWidth: shapes.strokeWidth,
        });
        arrow.addToStage(canvas.stage);
        arrow.on('click', arrowInstance => blurShapes(arrowInstance));
        arrow.on('mouseover', () => setCursor(cursorTypes.move));
        arrow.on('mouseout', () => setCursor(cursorTypes.auto));
        arrow.onAnchor('mouseover', () => setCursor(cursorTypes.pointer));
        arrow.onAnchor('mouseout', () => setCursor(cursorTypes.auto));
        addArrow(arrow);
    };

    render() {
        const { canvas } = this.props;
        return (
            <MainMenuItem
                onClick={this.onClick}
                disabled={canvas.image == null}
            >
                <Icon
                    name='mouse-pointer'
                    title='Arrow'
                />
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
        blurShapes,
        setCursor,
    }
)(MIArrow);
