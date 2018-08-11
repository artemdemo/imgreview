import React from 'react';
import { connect } from 'react-redux';
import MainMenuItem from './MainMenuItem';
import ColorSelector from '../ColorSelector/ColorSelector';
import OpenImageDialog from '../OpenImageDialog/OpenImageDialog';
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

        this.state = {
            showColorPicker: false,
        };

        this.openImgDialogRef = React.createRef();
    }

    clickOnItem = (item) => {
        const { saveCanvas, addArrow } = this.props;
        switch (item.id) {
            case 'open-image':
                this.openImgDialogRef.current.openDialog();
                break;
            case 'save':
                saveCanvas();
                break;
            case 'vector':
                addArrow();
                break;
            case 'color-selector':
                this.setState(prevState => ({
                    showColorPicker: !prevState.showColorPicker,
                }));
                break;
        }
    };

    isDisabled = (item) => {
        const { canvas } = this.props;
        switch (item.id) {
            case 'vector':
            case 'save':
                return canvas.image == null;
            default:
                return false;
        }
    };

    renderColorSelector() {
        const { canvas } = this.props;
        const item = {
            id: 'color-selector',
            name: 'Color selector',
        };
        return (
            <React.Fragment>
                <MainMenuItem
                    item={item}
                    onClick={this.clickOnItem}
                    disabled={canvas.image == null}
                    key={`main-menu-item__${item.id}`}
                >
                    Color
                </MainMenuItem>
                <ColorSelector visible={this.state.showColorPicker} />
            </React.Fragment>
        );
    }

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
                {this.renderColorSelector()}
                <OpenImageDialog
                    ref={this.openImgDialogRef}
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
