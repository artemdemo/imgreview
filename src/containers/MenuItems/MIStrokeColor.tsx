import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _isFunction from 'lodash/isFunction';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker, setStrokeColor } from '../../model/menu/menuActions';
import store from '../../store';

const getShapeColor = (shape) => {
    if (_isFunction(shape.getStrokeColor)) {
        return shape.getStrokeColor()
    }
    if (_isFunction(shape.getFillColor)) {
        return shape.getFillColor()
    }
    throw new Error('Can\'t get shape color');
};

// @ts-ignore
canvasApi.shapeClicked.on((shape) => {
    store.dispatch(setStrokeColor(getShapeColor(shape)))
});

const MIStrokeColor__Current = styled.div`
    display: inline-block;
    width: 20px;
    height: 18px;
    vertical-align: bottom;
`;

type TProps = {
    menu: TStateMenu;
    showColorPicker: () => void;
    disabled: boolean;
    show: boolean;
};

class MIStrokeColor extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    onClick = (e) => {
        // I need shape to stay in focus in order to change it's color
        // Therefore I'm not allowing to event to propagate up to MainMenu
        e.stopPropagation();

        const { showColorPicker } = this.props;
        showColorPicker();
    };

    render() {
        const { disabled, show, menu } = this.props;
        if (show) {
            return (
                <>
                    <TopMenuItem
                        onClick={this.onClick}
                        disabled={disabled}
                    >
                        <MIStrokeColor__Current
                            style={{
                                backgroundColor: menu.strokeColor,
                            }}
                        />
                        <ColorSelector />
                    </TopMenuItem>
                </>
            );
        }
        return null;
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    }),
    {
        showColorPicker,
    }
)(MIStrokeColor);
