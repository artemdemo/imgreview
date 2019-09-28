import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

class MIBlankCanvas extends React.PureComponent {
    onClick = () => {
        window.location.assign('https://github.com/artemdemo/img-review');
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
