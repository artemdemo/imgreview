import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { createArrow } from '../../canvas/api';
import { TReduxState } from '../../reducers';
import { TStateShapes } from '../../model/shapes/shapesReducer';

type Props = {
    disabled: boolean;
    shapes: TStateShapes,
};

class MIArrow extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = () => {
        const { shapes } = this.props;
        createArrow({
            strokeColor: shapes.strokeColor,
            strokeWidth: shapes.strokeWidth,
        });
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                <Icon
                    name='mouse-pointer'
                    title='Arrow'
                />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        shapes: state.shapes,
    })
)(MIArrow);
