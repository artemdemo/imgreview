import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';

class MIBlankCanvas extends React.PureComponent {
    onClick = () => {
        canvasApi.initBlankCanvas();
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

export default MIBlankCanvas;
