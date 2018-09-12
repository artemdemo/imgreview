import React from 'react';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog.async';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

class MIOpenImage extends React.PureComponent {
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
