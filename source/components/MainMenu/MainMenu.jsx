import React from 'react';

import './MainMenu.less';

class MainMenu extends React.PureComponent {
    render() {
        return (
            <div className='main-menu'>
                {this.props.children}
            </div>
        );
    }
}

export default MainMenu;
