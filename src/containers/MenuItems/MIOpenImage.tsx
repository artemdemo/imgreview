import React from 'react';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

type TProps = {
    disabled: boolean;
};

type TState = {
    open: boolean;
};

class MIOpenImage extends React.PureComponent<TProps, TState> {
    static readonly defaultProps = {
        disabled: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    onClick = () => {
        this.setState({
            open: true,
        }, () => {
            requestAnimationFrame(() => {
                this.setState({
                    open: false,
                });
            });
        });
    };

    render() {
        const {disabled} = this.props;
        return (
            <React.Fragment>
                <TopMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <Icon
                        name='folder-open-o'
                        title='Open'
                    />
                </TopMenuItem>
                <OpenImageDialog
                    open={this.state.open}
                />
            </React.Fragment>
        );
    }
}

export default MIOpenImage;
