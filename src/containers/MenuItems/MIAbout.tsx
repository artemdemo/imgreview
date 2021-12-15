import React from 'react';
import { Link } from 'react-router-dom';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

export const MIAbout: React.FC = () => {
  return (
    <TopMenuItem>
      <Link to="/about">About</Link>
    </TopMenuItem>
  );
};
