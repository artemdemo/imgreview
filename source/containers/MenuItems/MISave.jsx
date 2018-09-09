import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { saveCanvas } from '../../model/canvas/canvasActions';

class MISave extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };
        this.popupRef = React.createRef();
        this.nameRef = React.createRef();
    }

    onClick = () => {
        this.popupRef.current.show();
    };

    onPopupOpen = () => {
        const { canvas } = this.props;
        this.setState({
            name: canvas.imageOriginName,
        }, () => {
            this.nameRef.current.select();
        });
    };

    onSave = () => {
        const { saveCanvas } = this.props;
        const { name } = this.state;
        if (name !== '') {
            saveCanvas(name);
            this.setState({
                name: '',
            });
            this.popupRef.current.hide();
        }
    };

    onKeyUp = (e) => {
        // Save image by clicking on Enter
        if (e.keyCode === 13) {
            this.onSave();
        }
    };

    updateValue = (e) => {
        const { value } = e.target;
        if (value !== ' ') {
            this.setState({
                name: value.replace(/\s/g, ''),
            });
        }
    };

    render() {
        const { canvas } = this.props;
        return (
            <React.Fragment>
                <MainMenuItem
                    onClick={this.onClick}
                    disabled={canvas.image == null}
                >
                    <Icon
                        name='floppy-o'
                    />
                </MainMenuItem>
                <Popup
                    ref={this.popupRef}
                    buttons={[
                        {
                            className: 'btn btn-secondary',
                            text: 'Cancel',
                        },
                        {
                            className: 'btn btn-primary',
                            text: 'Save',
                            onClick: this.onSave,
                        },
                    ]}
                    onOpen={this.onPopupOpen}
                    showCloseBtn={false}
                >
                    <div className='form-group'>
                        <label htmlFor='saveAs'>Save as (*.png)</label>
                        <input
                            className='form-control'
                            placeholder='Enter file name'
                            value={this.state.name}
                            onChange={this.updateValue}
                            onKeyUp={this.onKeyUp}
                            ref={this.nameRef}
                            id='saveAs'
                        />
                    </div>
                </Popup>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }), {
        saveCanvas,
    },
)(MISave);
