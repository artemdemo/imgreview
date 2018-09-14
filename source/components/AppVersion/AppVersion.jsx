import React from 'react';

import './AppVersion.less';

class AppVersion extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            version: 'x.xx',
        };
    }

    componentDidMount() {
        const appVersionEl = document.querySelector('[name="app-version"]');
        if (appVersionEl) {
            this.setState({
                version: appVersionEl.getAttribute('content'),
            });
        }
    }

    render() {
        return (
            <div className='app-version'>
                {this.state.version}
            </div>
        );
    }
}

export default AppVersion;
