import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

class MIGithub extends React.PureComponent {
    render() {
        return (
            <TopMenuItem
                href='https://github.com/artemdemo/img-review'
            >
                <FontAwesomeIcon icon={faGithub} />
            </TopMenuItem>
        );
    }
}

export default MIGithub;
