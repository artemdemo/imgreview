/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import Icon from '../../../components/Icon/Icon';
import TopMenuItem from '../../../components/TopMenu/TopMenuItem';
import MIResizePopup from './MIResizePopup';
import { updateCanvasSize } from '../../../canvas/api';

type Props = {
    disabled: boolean;
};

type State = {
    width: number;
    height: number;
};

class MIResize extends React.PureComponent<Props, State> {
    private readonly popupRef: any;

    static readonly defaultProps = {
        disabled: false,
    };

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
        const width = Number(values.width);
        const height = Number(values.height);
        if (width > 0 && height > 0) {
            updateCanvasSize({width, height});
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

export default MIResize;
