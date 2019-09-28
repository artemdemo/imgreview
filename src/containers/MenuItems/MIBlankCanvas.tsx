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
        canvasApi.initBlankCanvas({
            width: 500,
            height: 500,
        });
        updateCanvasSize({
            width: 500,
            height: 500,
        });
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
