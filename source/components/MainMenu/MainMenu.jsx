import React from 'react';
import MainMenuItem from './MainMenuItem';

import './MainMenu.less';

const menu = [
    {
        name: 'Open image',
        icon: 'folder-open-o',
    },
    {
        name: 'Save',
        icon: 'floppy-o',
    },
];

class MainMenu extends React.PureComponent {
    clickOnItem = () => {};

    render() {
        return (
            <div className='main-menu'>
                {menu.map(item => (
                    <MainMenuItem
                        item={item}
                        onClick={this.clickOnItem}
                        key={`main-menu-item__${item.icon}`}
                    />
                ))}
            </div>
        );
    }
}

export default MainMenu;
