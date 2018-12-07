/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import PopupButtonsContainer from '../../components/Popup/PopupButtonsContainer';
import Button from '../../components/Button/Button';
import FormGroup from '../../components/FormGroup/FormGroup';
import FormInput from '../../components/FormInput/FormInput';
import FormButtonsRow from '../../components/FormButtonsRow/FormButtonsRow';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { couldBeNumber } from '../../services/number';
import { updateImageSize } from '../../model/canvas/canvasActions';

class MIResize extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            width: '0',
            height: '0',
        };

        this.popupRef = React.createRef();
    }

    onClick = () => {
        this.popupRef.current.show();
    };

    onCancel = () => {
        this.popupRef.current.hide();
    };

    onPopupOpen = () => {
        const { canvas } = this.props;
        const { width, height } = canvas.image.getSize();
        this.setState({
            width,
            height,
        });
    };

    onSubmit = (values) => {
        const { updateImageSize } = this.props;
        const width = Number(values.width);
        const height = Number(values.height);
        if (width > 0 && height > 0) {
            updateImageSize({width, height});
            this.popupRef.current.hide();
        }
    };

    // ToDo: Since I started to use final-form this method is not in use
    //  but I want to find a way to use it.
    // updateSize(sizeKey, e) {
    //     const { value } = e.target;
    //     const secondSizeKey = sizeKey === 'width' ? 'height' : 'width';
    //
    //     const calcSecondSize = () => {
    //         if (value === '') {
    //             return '';
    //         }
    //         const numValue = Number(value);
    //         const ratio = this.state[`${secondSizeKey}Init`] / this.state[`${sizeKey}Init`];
    //         return Math.round(numValue * ratio);
    //     };
    //
    //     if (couldBeNumber(value) || value === '') {
    //         this.setState({
    //             [sizeKey]: value,
    //             [secondSizeKey]: calcSecondSize(),
    //         });
    //     }
    // }

    render() {
        const { canvas } = this.props;
        return (
            <React.Fragment>
                <MainMenuItem
                    onClick={this.onClick}
                    disabled={canvas.image == null}
                >
                    <Icon
                        name='expand'
                        title='Resize'
                    />
                </MainMenuItem>
                <Popup
                    title='Resize image'
                    ref={this.popupRef}
                    onOpen={this.onPopupOpen}
                    showCloseBtn={false}
                >
                    <Form
                        initialValues={this.state}
                        onSubmit={this.onSubmit}
                        validate={(values) => {
                            const errors = {};
                            if (!couldBeNumber(values.width)) {
                                errors.width = 'Must be a number';
                            } else if (Number(values.width) > 5000) {
                                errors.width = 'Value is too big';
                            }
                            if (!couldBeNumber(values.height)) {
                                errors.height = 'Must be a number';
                            } else if (Number(values.height) > 5000) {
                                errors.height = 'Value is too big';
                            }
                            return errors;
                        }}
                        render={({ handleSubmit, invalid, form }) => (
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-sm'>
                                        <Field
                                            name='width'
                                            render={({ input, meta }) => (
                                                <FormGroup
                                                    errorText={meta.error}
                                                >
                                                    <label htmlFor='img-width'>Width (px)</label>
                                                    <FormInput
                                                        placeholder='Enter width'
                                                        id='img-width'
                                                        {...input}
                                                    />
                                                </FormGroup>
                                            )}
                                        />
                                    </div>
                                    <div className='col-sm'>
                                        <Field
                                            name='height'
                                            render={({ input, meta }) => (
                                                <FormGroup
                                                    errorText={meta.error}
                                                >
                                                    <label htmlFor='img-height'>Height (px)</label>
                                                    <FormInput
                                                        placeholder='Enter height'
                                                        id='img-height'
                                                        {...input}
                                                    />
                                                </FormGroup>
                                            )}
                                        />
                                    </div>
                                </div>
                                <PopupButtonsContainer>
                                    <FormButtonsRow>
                                        <Button
                                            onClick={this.onCancel}
                                            secondary
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type='submit'
                                            disabled={invalid}
                                        >
                                            Resize
                                        </Button>
                                    </FormButtonsRow>
                                </PopupButtonsContainer>
                            </form>
                        )}
                    />
                </Popup>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }), {
        updateImageSize,
    },
)(MIResize);
