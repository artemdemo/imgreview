import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker } from '../../model/shapes/shapesActions';

type Props = {
    canvas: any;
    shapes: any;
    showColorPicker: () => any;
};

class MIStrokeColor extends React.PureComponent<Props> {
    onClick = (e) => {
        const { showColorPicker } = this.props;
        showColorPicker();

        // I need shape to stay in focus in order to change it's color
        // Therefore I'm not allowing to event to propagate up to MainMenu
        e.stopPropagation();
    };

    render() {
        const { canvas, shapes } = this.props;
        return (
            <React.Fragment>
                <MainMenuItem
                    onClick={this.onClick}
                    disabled={canvas.image == null}
                >
                    <div
                        className='main-menu-color'
                        style={{
                            backgroundColor: shapes.stroke,
                        }}
                    />
                </MainMenuItem>
                <ColorSelector />
            </React.Fragment>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
        shapes: state.shapes,
    }),
    {
        showColorPicker,
    }
)(MIStrokeColor);
