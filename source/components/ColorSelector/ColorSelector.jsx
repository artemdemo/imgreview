import React from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import enhanceWithClickOutside from 'react-click-outside';
import { setStroke, hideColorPicker } from '../../model/shapes/shapesActions';

import './ColorSelector.less';

class ColorSelector extends React.PureComponent {
    onChangeColor = (color) => {
        const { setStroke } = this.props;
        setStroke(color.hex);
    };

    handleClickOutside = () => {
        const { hideColorPicker } = this.props;
        hideColorPicker();
    };

    render() {
        const { shapes } = this.props;

        if (shapes.showColorPicker) {
            return (
                <ChromePicker
                    color={shapes.stroke}
                    onChange={this.onChangeColor}
                    className='color-selector'
                />
            );
        }

        return null;
    }
}

export default connect(
    state => ({
        shapes: state.shapes,
    }), {
        setStroke,
        hideColorPicker,
    },
)(enhanceWithClickOutside(ColorSelector));
