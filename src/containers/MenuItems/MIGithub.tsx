import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';

export const MIGithub: React.FC = () => {
  return (
    <TopMenuItem href="https://github.com/artemdemo/imgreview">
      <FontAwesomeIcon icon={faGithub} />
    </TopMenuItem>
  );
};
