import React from 'react';
import { connect } from 'react-redux';
import MainMenuItem from './MainMenuItem';
import LoadImg from '../../components/LoadImg/LoadImg';
import { saveCanvas, addArrow } from '../../model/canvas/canvasActions';

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
        const { saveCanvas, addArrow } = this.props;
        switch (item.id) {
            case 'open-image':
                this.loadImgRef.current.loadImg();
                break;
            case 'save':
                saveCanvas();
                break;
            case 'vector':
                addArrow();
                break;
        }
    };

    isDisabled = (item) => {
        const { canvas } = this.props;
        switch (item.id) {
            case 'vector':
            case 'save':
                return canvas.hasImage === false;
            default:
                return false;
        }
    };

    render() {
        return (
            <div className='main-menu'>
                {menu.map((item) => {
                    const disabled = this.isDisabled(item);
                    return (
                        <MainMenuItem
                            item={item}
                            onClick={this.clickOnItem}
                            disabled={disabled}
                            key={`main-menu-item__${item.icon}`}
                        />
                    );
                })}
                <LoadImg
                    ref={this.loadImgRef}
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }),
    {
        saveCanvas,
        addArrow,
    }
)(MainMenu);
