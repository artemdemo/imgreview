import React from 'react';
import styled from 'styled-components';

const AppVersionSty = styled.div`
    position: fixed;
    bottom: 0;
    right: 5px;
    opacity: 0.2;
`;

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
            <AppVersionSty>
                {this.state.version}
            </AppVersionSty>
        );
    }
}

export default AppVersion;
