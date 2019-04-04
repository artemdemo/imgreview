import React from 'react';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

class MIGithub extends React.PureComponent {
    onClick = () => {
        window.location.assign('https://github.com/artemdemo/img-review');
    };

    render() {
        return (
            <MainMenuItem
                onClick={this.onClick}
            >
                <Icon
                    name='github'
                    title='Github'
                />
            </MainMenuItem>
        );
    }
}

export default MIGithub;
