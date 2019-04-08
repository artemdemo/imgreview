import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { setStrokeWidth, TSetStrokeWidth } from '../../model/shapes/shapesActions';
import { TStateShapes } from '../../model/shapes/shapesReducer';

type Props = {
    shapes: TStateShapes;
    setStrokeWidth: TSetStrokeWidth;
    disabled: boolean;
};

class MIStrokeWidth extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    handleSubMenuClick = (item, e) => {
        e.stopPropagation();
        const { setStrokeWidth } = this.props;
        setStrokeWidth(item.value);
    };

    render() {
        const { shapes, disabled } = this.props;
        return (
            <MainMenuItem
                subMenu={[
                    {
                        text: '2px',
                        value: 2,
                        selected: shapes.strokeWidth === 2,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '3px',
                        value: 3,
                        selected: shapes.strokeWidth === 3,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '5px',
                        value: 5,
                        selected: shapes.strokeWidth === 5,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '8px',
                        value: 8,
                        selected: shapes.strokeWidth === 8,
                        onClick: this.handleSubMenuClick,
                    },
                ]}
                disabled={disabled}
            >
                <Icon
                    name='pencil'
                    title='Size'
                />
            </MainMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        shapes: state.shapes,
    }),
    {
        setStrokeWidth,
    }
)(MIStrokeWidth);
