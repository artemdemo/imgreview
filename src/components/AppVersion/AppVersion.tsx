import React from 'react';
import styled from 'styled-components';

const AppVersionSty = styled.div`
    position: fixed;
    bottom: 0;
    right: 5px;
    opacity: 0.2;
`;

type TProps = {};

type TState = {
    version: string,
};

class AppVersion extends React.PureComponent<TProps, TState> {
    private readonly defaultVersion = 'x.xx';

    state = {
        version: this.defaultVersion,
    };

    componentDidMount() {
        const appVersionEl = document.querySelector('[name="app-version"]');
        if (appVersionEl) {
            this.setState({
                version: appVersionEl.getAttribute('content') || this.defaultVersion,
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
