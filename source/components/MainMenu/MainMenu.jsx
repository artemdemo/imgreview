import React from 'react';
import _get from 'lodash/get';
import MainMenuItem from './MainMenuItem';
import * as canvas from '../../canvas/canvas';

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

    readImage = () => {
        const file = _get(this.inputFile, 'current.files[0]', null);

        if (file) {
            const FR = new FileReader();
            FR.onload = (e) => {
                const img = new Image();
                img.addEventListener('load', () => {
                    canvas.drawImage(img);
                });
                img.src = e.target.result;
            };
            FR.readAsDataURL(file);
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
                    onChange={this.readImage}
                    ref={this.inputFile}
                    style={{display: 'none'}}
                />
            </div>
        );
    }
}

export default MainMenu;
