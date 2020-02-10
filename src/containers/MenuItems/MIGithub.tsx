import React from 'react';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

class MIGithub extends React.PureComponent {
    render() {
        return (
            <TopMenuItem
                href='https://github.com/artemdemo/img-review'
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
