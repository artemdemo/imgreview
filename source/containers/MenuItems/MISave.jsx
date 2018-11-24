/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import FormGroup from '../../components/FormGroup/FormGroup';
import FormInput from '../../components/FormInput/FormInput';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { saveCanvas } from '../../model/canvas/canvasActions';
import { blurShapes } from '../../model/shapes/shapesActions';

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
        const { blurShapes } = this.props;
        blurShapes();
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
                        title='Save'
                    />
                </MainMenuItem>
                <Popup
                    ref={this.popupRef}
                    buttons={[
                        {
                            secondary: true,
                            text: 'Cancel',
                        },
                        {
                            primary: true,
                            text: 'Save',
                            onClick: this.onSave,
                        },
                    ]}
                    onOpen={this.onPopupOpen}
                    showCloseBtn={false}
                >
                    <FormGroup>
                        <label htmlFor='saveAs'>Save as (*.png)</label>
                        <FormInput
                            placeholder='Enter file name'
                            value={this.state.name}
                            onChange={this.updateValue}
                            onKeyUp={this.onKeyUp}
                            ref={this.nameRef}
                            type='text'
                            id='saveAs'
                        />
                    </FormGroup>
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
        blurShapes,
    },
)(MISave);
