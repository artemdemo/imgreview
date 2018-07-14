import React from 'react';
import Icon from '../Icon/Icon';

import './MainMenu.less';

const menu = [
    {
        name: 'Open image',
        icon: 'folder-open-o',
    },
];

const MainMenu = () => {
    return (
        <div className='main-menu'>
            {menu.map(item => (
                <div key={`main-menu-item__${item.icon}`}>
                    <Icon name={item.icon} />
                </div>
            ))}
        </div>
    );
};

export default MainMenu;
