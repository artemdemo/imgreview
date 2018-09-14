import React from 'react';
import Icon from '../../components/Icon/Icon';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

class MIGithub extends React.PureComponent {
    onClick = () => {
        window.location.href = 'https://github.com/artemdemo/img-review';
    };

    render() {
        return (
            <MainMenuItem
                onClick={this.onClick}
                right
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
