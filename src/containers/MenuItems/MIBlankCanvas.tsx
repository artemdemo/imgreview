import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { updateCanvasSize, TUpdateCanvasSize } from '../../model/canvas/canvasActions';
import * as canvasApi from '../../../srcCanvas/api';

type TProps = {
    updateCanvasSize: TUpdateCanvasSize;
    show: boolean,
};

class MIBlankCanvas extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        show: false,
    };

    onClick = () => {
        const { updateCanvasSize } = this.props;
        const config = {
            width: 800,
            height: 500,
        };
        canvasApi.initBlankCanvas(config);
        updateCanvasSize(config);
    };

    render() {
        const { show } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                show={show}
                stopPropagation={false}
            >
                Blank
            </TopMenuItem>
        );
    }
}

export default connect(
    () => ({}),
    {
        updateCanvasSize,
    },
)(MIBlankCanvas);
