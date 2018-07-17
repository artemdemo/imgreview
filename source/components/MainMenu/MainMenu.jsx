import React from 'react';
import MainMenuItem from './MainMenuItem';

import './MainMenu.less';

const menu = [
    {
        id: 'open-image',
        name: 'Open image',
        icon: 'folder-open-o',
    },
    {
        id: 'save',
        name: 'Save',
        icon: 'floppy-o',
    },
    {
        id: 'vector',
        name: 'Vector',
        icon: 'mouse-pointer',
    },
];

class MainMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputFile = React.createRef();
    }

    clickOnItem = (item) => {
        switch (item.id) {
            case 'open-image':
                this.inputFile.current.click();
                break;
        }
    };

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
                <input
                    type='file'
                    ref={this.inputFile}
                    style={{display: 'none'}}
                />
            </div>
        );
    }
}

export default MainMenu;
