import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import { TStateShapes } from '../../model/shapes/shapesReducer';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector.async';
import { showColorPicker } from '../../model/shapes/shapesActions';

import './MIStrokeColor.less';

type Props = {
    shapes: TStateShapes;
    showColorPicker: () => void;
    disabled: boolean;
};

class MIStrokeColor extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = (e) => {
        const { showColorPicker } = this.props;
        showColorPicker();

        // I need shape to stay in focus in order to change it's color
        // Therefore I'm not allowing to event to propagate up to MainMenu
        e.stopPropagation();
    };

    render() {
        const { disabled, shapes } = this.props;
        return (
            <React.Fragment>
                <MainMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <div
                        className='main-menu-color'
                        style={{
                            backgroundColor: shapes.strokeColor,
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
        shapes: state.shapes,
    }),
    {
        showColorPicker,
    }
)(MIStrokeColor);
