import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../canvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';

type Props = {
    disabled: boolean;
    menu: TStateMenu,
};

class MIArrow extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = () => {
        const { menu } = this.props;
        canvasApi.createArrow({
            strokeColor: menu.strokeColor,
            strokeWidth: menu.strokeWidth,
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
        menu: state.menu,
    })
)(MIArrow);
