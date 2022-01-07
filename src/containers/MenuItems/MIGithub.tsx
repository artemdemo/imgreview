import React from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';

export const MIGithub: React.FC = () => {
  return (
    <TopMenuItem link={{ href: 'https://github.com/artemdemo/imgreview' }}>
      Github
    </TopMenuItem>
  );
};
