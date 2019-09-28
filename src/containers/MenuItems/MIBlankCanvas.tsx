import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { updateCanvasSize, TUpdateCanvasSize } from '../../model/canvas/canvasActions';
import * as canvasApi from '../../../srcCanvas/api';

type Props = {
    updateCanvasSize: TUpdateCanvasSize;
};

class MIBlankCanvas extends React.PureComponent<Props> {
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
        return (
            <TopMenuItem
                onClick={this.onClick}
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
