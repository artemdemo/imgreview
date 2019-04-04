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
};

class MIStrokeSize extends React.PureComponent<Props> {
    handleSubMenuClick = (item) => {
        const { setStrokeWidth } = this.props;
        setStrokeWidth(item.value);
    };

    render() {
        return (
            <MainMenuItem
                subMenu={[
                    {text: '2px', value: 2, onClick: this.handleSubMenuClick},
                    {text: '3px', value: 3, onClick: this.handleSubMenuClick},
                    {text: '5px', value: 5, onClick: this.handleSubMenuClick},
                    {text: '8px', value: 8, onClick: this.handleSubMenuClick},
                ]}
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
)(MIStrokeSize);
