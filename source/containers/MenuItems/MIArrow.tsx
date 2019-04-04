import React from 'react';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { connectArrow } from '../../model/connectShape';

type Props = {
    canvas: any;
    disabled: boolean;
};

class MIArrow extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = () => {
        connectArrow();
    };

    render() {
        const { disabled } = this.props;
        return (
            <MainMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                <Icon
                    name='mouse-pointer'
                    title='Arrow'
                />
            </MainMenuItem>
        );
    }
}

export default MIArrow;
