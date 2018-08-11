import React from 'react';
import OpenImageDialog from '../../components/OpenImageDialog/OpenImageDialog';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

class MIOpenImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.openImgDialogRef = React.createRef();
    }

    onClick = () => {
        this.openImgDialogRef.current.openDialog();
    };

    render() {
        return (
            <React.Fragment>
                <MainMenuItem onClick={this.onClick}>
                    <Icon
                        name='folder-open-o'
                    />
                </MainMenuItem>
                <OpenImageDialog
                    ref={this.openImgDialogRef}
                />
            </React.Fragment>
        );
    }
}

export default MIOpenImage;
