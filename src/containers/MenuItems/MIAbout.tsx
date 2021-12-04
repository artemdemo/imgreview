import React from 'react';
import { Link } from 'react-router-dom';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';

class MIAbout extends React.PureComponent {
  render() {
    return (
      <TopMenuItem>
        <Link to="/about">About</Link>
      </TopMenuItem>
    );
  }
}

export default MIAbout;
