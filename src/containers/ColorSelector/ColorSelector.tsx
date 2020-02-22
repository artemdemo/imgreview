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

const ColorSelectorWrapper = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
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

    // ColorSelector could be placed somewhere in the Menu container.
    // In this case I don't want click events to bubble up.
    onClickWrapper = e => e.stopPropagation();

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

        return (
            <ColorSelectorWrapper
                onClick={this.onClickWrapper}
                show={menu.showColorPicker}
                style={{
                    top: menu.menuHeight,
                }}
            >
                <ChromePicker
                    onChange={this.onChangeColor}
                    color={menu.strokeColor}
                />
            </ColorSelectorWrapper>
        );
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
