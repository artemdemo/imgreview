import React from 'react';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

class MIGithub extends React.PureComponent {
    onClick = () => {
        window.location.assign('https://github.com/artemdemo/img-review');
    };

    render() {
        return (
            <TopMenuItem
                onClick={this.onClick}
            >
                <Icon
                    name='github'
                    title='Github'
                />
            </TopMenuItem>
        );
    }
}

export default MIGithub;
