/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../../components/Icon/Icon';
import MainMenuItem from '../../../components/MainMenu/MainMenuItem';
import MIResizePopup from './MIResizePopup';
import { updateImageSize, TUpdateImageSize } from '../../../model/canvas/canvasActions';
import { TReduxState } from '../../../reducers';

type Props = {
    canvas: any;
    updateImageSize: TUpdateImageSize;
};

type State = {
    width: number;
    height: number;
};

class MIResize extends React.PureComponent<Props, State> {
    private readonly popupRef: any;

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
        };

        this.popupRef = React.createRef();
    }

    onClick = () => {
        const { canvas } = this.props;
        const { width, height } = canvas.image.getSize();
        this.setState({
            width,
            height,
        }, () => {
            this.popupRef.current.show();
        });
    };

    onSubmit = (values) => {
        const { updateImageSize } = this.props;
        const width = Number(values.width);
        const height = Number(values.height);
        if (width > 0 && height > 0) {
            updateImageSize({width, height});
        }
    };

    render() {
        const { canvas } = this.props;
        return (
            <React.Fragment>
                <MainMenuItem
                    onClick={this.onClick}
                    disabled={canvas.image == null}
                >
                    <Icon
                        name='expand'
                        title='Resize'
                    />
                </MainMenuItem>
                <MIResizePopup
                    widthInit={this.state.width}
                    heightInit={this.state.height}
                    onSubmit={this.onSubmit}
                    ref={this.popupRef}
                />
            </React.Fragment>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        canvas: state.canvas,
    }), {
        updateImageSize,
    },
)(MIResize);
