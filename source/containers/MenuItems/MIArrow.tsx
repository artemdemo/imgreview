import React from 'react';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { createArrow } from '../../canvas/api';

type Props = {
    disabled: boolean;
};

class MIArrow extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = () => {
        createArrow();
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

export default MIArrow;
