import React from 'react';
import { connect } from 'react-redux';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker } from '../../model/shapes/shapesActions';

class MIStroke extends React.PureComponent {
    onClick = () => {
        const { showColorPicker } = this.props;
        showColorPicker();
    };

    render() {
        const { canvas, shapes } = this.props;
        const item = {
            id: 'color-selector',
            name: 'Color selector',
        };
        return (
            <React.Fragment>
                <MainMenuItem
                    item={item}
                    onClick={this.onClick}
                    disabled={canvas.image == null}
                    key={`main-menu-item__${item.id}`}
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
    state => ({
        canvas: state.canvas,
        shapes: state.shapes,
    }),
    {
        showColorPicker,
    }
)(MIStroke);
