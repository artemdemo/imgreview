import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setStrokeWidth, TSetStrokeWidth } from '../../model/menu/shapesActions';
import { TStateShapes } from '../../model/menu/shapesReducer';

type Props = {
    shapes: TStateShapes;
    setStrokeWidth: TSetStrokeWidth;
    disabled: boolean;
};

class MIStrokeWidth extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    handleMenuClick = (e) => {
        // There is no specific action on this menu click event.
        // But I don't want to blur selected shape, therefore stopping propagation.
        e.stopPropagation();
    };

    handleSubMenuClick = (item, e) => {
        // I'm stopping propagation, because I don't want to blur shapes.
        // Selected shape should stay selected in order to continue to change width.
        e.stopPropagation();

        const { setStrokeWidth } = this.props;
        setStrokeWidth(item.value);
    };

    render() {
        const { shapes, disabled } = this.props;
        return (
            <TopMenuItem
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
                onClick={this.handleMenuClick}
            >
                <Icon
                    name='pencil'
                    title='Size'
                />
            </TopMenuItem>
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
