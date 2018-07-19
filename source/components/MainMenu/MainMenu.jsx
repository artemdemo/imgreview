import React from 'react';
import MainMenuItem from './MainMenuItem';
import LoadImg from '../../components/LoadImg/LoadImg';

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

        this.loadImgRef = React.createRef();
    }

    clickOnItem = (item) => {
        switch (item.id) {
            case 'open-image':
                this.loadImgRef.current.loadImg();
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
                <LoadImg
                    ref={this.loadImgRef}
                />
            </div>
        );
    }
}

export default MainMenu;
