/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, FormSpy } from 'react-final-form';
import Icon from '../../../components/Icon/Icon';
import Popup from '../../../components/Popup/Popup';
import PopupButtonsContainer from '../../../components/Popup/PopupButtonsContainer';
import Button from '../../../components/Button/Button';
import FormGroup from '../../../components/FormGroup/FormGroup';
import FormInput from '../../../components/FormInput/FormInput';
import FormButtonsRow from '../../../components/FormButtonsRow/FormButtonsRow';
import MainMenuItem from '../../../components/MainMenu/MainMenuItem';
import { couldBeNumber } from '../../../services/number';
import { updateImageSize } from '../../../model/canvas/canvasActions';

class MIResize extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            width: '0',
            height: '0',
        };

        this.popupRef = React.createRef();

        this.widthInit = 0;
        this.heightInit = 0;
    }

    onClick = () => {
        const { canvas } = this.props;
        const { width, height } = canvas.image.getSize();
        this.widthInit = width;
        this.heightInit = height;
        this.setState({
            width,
            height,
        }, () => {
            this.popupRef.current.show();
        });
    };

    onCancel = () => {
        this.popupRef.current.hide();
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

    render() {
        const { canvas } = this.props;
        let __stateValueTmp = 100;
        let __prevActiveValue = 0;
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
                    showCloseBtn={false}
                >
                    <Form
                        initialValues={this.state}
                        onSubmit={this.onSubmit}
                        mutators={{
                            set_height: (args, state, utils) => {
                                utils.changeValue(state, 'height', () => __stateValueTmp);
                            },
                            set_width: (args, state, utils) => {
                                utils.changeValue(state, 'width', () => __stateValueTmp);
                            },
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!couldBeNumber(values.width)) {
                                errors.width = 'Must be a number';
                            } else if (Number(values.width) < 80) {
                                errors.width = 'Value is too small';
                            } else if (Number(values.width) > 5000) {
                                errors.width = 'Value is too big';
                            }
                            if (!couldBeNumber(values.height)) {
                                errors.height = 'Must be a number';
                            } else if (Number(values.height) < 80) {
                                errors.height = 'Value is too small';
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
                                <FormSpy
                                    subscription={{
                                        active: true,
                                        values: true,
                                    }}
                                    onChange={({ active, values }) => {
                                        if (!!active && __prevActiveValue !== values[active]) {
                                            const secondSizeKey = active === 'width' ? 'height' : 'width';
                                            const calcSecondSize = () => {
                                                if (values[active] === '') {
                                                    return '';
                                                }
                                                const numValue = Number(values[active]);
                                                const ratio = this[`${secondSizeKey}Init`] / this[`${active}Init`];
                                                return Math.round(numValue * ratio);
                                            };

                                            __stateValueTmp = calcSecondSize();
                                            __prevActiveValue = values[active];
                                            form.mutators[`set_${secondSizeKey}`]();
                                        }
                                    }}
                                />
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
