/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import { TStateCanvas } from '../../../model/canvas/canvasReducer';
import { TReduxState } from '../../../reducers';
import Icon from '../../../components/Icon/Icon';
import TopMenuItem from '../../../components/TopMenu/TopMenuItem';
import MIResizePopup from './MIResizePopup';
import * as canvasApi from '../../../../srcCanvas/api';

type Props = {
    disabled: boolean;
    canvas: TStateCanvas;
};

type State = {
    width: number;
    height: number;
};

class MIResize extends React.PureComponent<Props, State> {
    private popupRef = React.createRef<MIResizePopup>();

    static readonly defaultProps = {
        disabled: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
        };
    }

    onClick = () => {
        const { canvas } = this.props;
        this.setState({
            width: canvas.width,
            height: canvas.height,
        }, () => {
            this.popupRef.current?.show();
        });
    };

    onSubmit = (values) => {
        const width = Number(values.width);
        const height = Number(values.height);
        if (width > 0 && height > 0) {
            canvasApi.updateCanvasSize({width, height});
        }
    };

    render() {
        const { disabled } = this.props;
        return (
            <React.Fragment>
                <TopMenuItem
                    onClick={this.onClick}
                    disabled={disabled}
                >
                    <Icon
                        name='expand'
                        title='Resize'
                    />
                </TopMenuItem>
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
    })
)(MIResize);
