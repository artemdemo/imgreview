import React from 'react';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import onClickOutside from 'react-click-outside';
import styled from 'styled-components';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import {
    TSetStrokeColor,
    setStrokeColor,
    THideColorPicker,
    hideColorPicker,
} from '../../model/menu/menuActions';
import * as api from '../../../srcCanvas/api';

const ChromePickerSty = styled(ChromePicker)`
    position: absolute;
    z-index: 10;
`;

type TProps = {
    menu: TStateMenu;
    setStrokeColor: TSetStrokeColor;
    hideColorPicker: THideColorPicker;
};

class ColorSelector extends React.PureComponent<TProps> {
    onChangeColor = (color) => {
        const { setStrokeColor } = this.props;
        setStrokeColor(color.hex);
        api.setStrokeColorToActiveShape(color.hex)
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
                <ChromePickerSty
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
    (state: TReduxState) => ({
        menu: state.menu,
    }), {
        setStrokeColor,
        hideColorPicker,
    },
)(onClickOutside(ColorSelector));
