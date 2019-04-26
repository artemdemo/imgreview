import React from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import onClickOutside from 'react-click-outside';
import { setStrokeColor, hideColorPicker } from '../../model/menu/menuActions';

import './ColorSelector.less';

class ColorSelector extends React.PureComponent {
    onChangeColor = (color) => {
        const { setStrokeColor } = this.props;
        setStrokeColor(color.hex);
    };

    handleClickOutside = () => {
        const { hideColorPicker, menu } = this.props;
        // Color picker should be hidden only after he was shown :)
        // Besides this obvious reason - in any other case I just will make two actions to race:
        // Who will act first: show color picker or hide it
        if (menu.showColorPicker) {
            hideColorPicker();
        }
    };

    render() {
        const { menu } = this.props;

        if (menu.showColorPicker) {
            return (
                <ChromePicker
                    color={menu.strokeColor}
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
        menu: state.menu,
    }), {
        setStrokeColor,
        hideColorPicker,
    },
)(onClickOutside(ColorSelector));
