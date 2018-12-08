import React from 'react';

// In this case I'm using class instead of function,
// because MIResize will use ref={}
class MIResizePopup extends React.Component {
    render() {
        return (
            <div data-mock='MIResizePopup'>
                widthInit: {this.props.widthInit}
                heightInit: {this.props.heightInit}
            </div>
        );
    }
}

export default MIResizePopup;
