import React from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import onClickOutside from 'react-click-outside';
import { setStroke, hideColorPicker } from '../../model/shapes/shapesActions';

import './ColorSelector.less';

class ColorSelector extends React.PureComponent {
    onChangeColor = (color) => {
        const { setStroke } = this.props;
        setStroke(color.hex);
    };

    handleClickOutside = () => {
        const { hideColorPicker, shapes } = this.props;
        // Color picker should be hidden only after he was shown :)
        // Besides this obvious reason - in any other case I just will make two actions to race:
        // Who will act first: show color picker or hide it
        if (shapes.showColorPicker) {
            hideColorPicker();
        }
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
)(onClickOutside(ColorSelector));
