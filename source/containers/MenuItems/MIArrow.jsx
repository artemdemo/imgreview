import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { connectArrow } from '../../model/connectShape';

class MIArrow extends React.PureComponent {
    onClick = () => {
        connectArrow();
    };

    render() {
        const { canvas } = this.props;
        return (
            <MainMenuItem
                onClick={this.onClick}
                disabled={canvas.image == null}
            >
                <Icon
                    name='mouse-pointer'
                    title='Arrow'
                />
            </MainMenuItem>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }),
)(MIArrow);
