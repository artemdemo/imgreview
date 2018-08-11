import React from 'react';

import './MainMenu.less';

const MainMenu = (props) => {
    return (
        <div className='main-menu'>
            {props.children}
        </div>
    );
};

export default MainMenu;
