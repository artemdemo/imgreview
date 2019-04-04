import React from 'react';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

type State = {
    open: boolean;
};

class MIOpenImage extends React.PureComponent<{}, State> {
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
        return (
            <React.Fragment>
                <MainMenuItem onClick={this.onClick}>
                    <Icon
                        name='folder-open-o'
                        title='Open'
                    />
                </MainMenuItem>
                <OpenImageDialog
                    open={this.state.open}
                />
            </React.Fragment>
        );
    }
}

export default MIOpenImage;
