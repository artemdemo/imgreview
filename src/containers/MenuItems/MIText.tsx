import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import Icon from '../../components/Icon/Icon';

type TProps = {
    disabled: boolean;
};

class MIText extends React.PureComponent<TProps> {
    onClick = () => {};

    render() {
        const { disabled } = this.props;
        return (
            <React.Fragment>
                <TopMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <Icon
                        name='font'
                        title='Add Text'
                    />
                </TopMenuItem>
            </React.Fragment>
        );
    }
}

export default MIText;
