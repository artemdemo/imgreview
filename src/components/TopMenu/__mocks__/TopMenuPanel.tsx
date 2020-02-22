import React from 'react';

class TopMenuPanel extends React.PureComponent {
    render() {
        return (
            <div data-mock='TopMenuPanel'>
                {this.props.children}
            </div>
        );
    }
}

export default TopMenuPanel;
