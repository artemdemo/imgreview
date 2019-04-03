/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, FormSpy } from 'react-final-form';
import FormGroup from '../../../components/FormGroup/FormGroup';
import FormInput from '../../../components/FormInput/FormInput';
import PopupButtonsContainer from '../../../components/Popup/PopupButtonsContainer';
import FormButtonsRow from '../../../components/FormButtonsRow/FormButtonsRow';
import Button from '../../../components/Button/Button';
import Popup from '../../../components/Popup/Popup';
import { couldBeNumber } from '../../../services/number';

class MIResizePopup extends React.PureComponent {
    static validate(values) {
        const errors = {};
        const fields = ['width', 'height'];
        fields.forEach((field) => {
            if (!couldBeNumber(values[field])) {
                errors[field] = 'Must be a number';
            } else if (Number(values[field]) < 80) {
                errors[field] = 'Value is too small';
            } else if (Number(values[field]) > 5000) {
                errors[field] = 'Value is too big';
            }
        });
        return errors;
    }

    constructor(props) {
        super(props);

        this.popupRef = React.createRef();
        this._stateValueTmp = null;
        this._prevActiveValue = null;
    }

    onCancel = (reset) => {
        reset();
        this.popupRef.current.hide();
    };

    onSubmit = (...rest) => {
        const { onSubmit } = this.props;
        onSubmit && onSubmit(...rest);
        this.popupRef.current.hide();
    };

    onFormStateChange(form, { active, values }) {
        if (!!active && couldBeNumber(values[active]) && this._prevActiveValue !== values[active]) {
            const secondSizeKey = active === 'width' ? 'height' : 'width';
            const calcSecondSize = () => {
                if (values[active] === '') {
                    return '';
                }
                const numValue = Number(values[active]);
                const ratio = this.props[`${secondSizeKey}Init`] / this.props[`${active}Init`];
                return Math.round(numValue * ratio);
            };

            this._stateValueTmp = calcSecondSize();
            this._prevActiveValue = values[active];
            form.mutators[`set_${secondSizeKey}`]();
        }
    }

    /**
     * @public
     */
    show() {
        this.popupRef.current.show();
    }

    renderFormSpy(form) {
        return (
            <FormSpy
                subscription={{
                    active: true,
                    values: true,
                }}
                onChange={this.onFormStateChange.bind(this, form)}
            />
        );
    }

    renderField(fieldKey) {
        return (
            <Field
                name={fieldKey}
                render={({ input, meta }) => (
                    <FormGroup
                        errorText={meta.error}
                    >
                        <label
                            htmlFor={`img-${fieldKey}`}
                        >
                            {fieldKey} (px)
                        </label>
                        <FormInput
                            placeholder={`Enter ${fieldKey}`}
                            id={`img-${fieldKey}`}
                            {...input}
                        />
                    </FormGroup>
                )}
            />
        );
    }

    render() {
        const { widthInit, heightInit } = this.props;
        return (
            <Popup
                title='Resize image'
                ref={this.popupRef}
                showCloseBtn={false}
            >
                <Form
                    initialValues={{
                        width: widthInit,
                        height: heightInit,
                    }}
                    onSubmit={this.onSubmit}
                    mutators={{
                        set_height: (args, state, utils) => {
                            utils.changeValue(state, 'height', () => this._stateValueTmp);
                        },
                        set_width: (args, state, utils) => {
                            utils.changeValue(state, 'width', () => this._stateValueTmp);
                        },
                    }}
                    validate={MIResizePopup.validate}
                    render={({ handleSubmit, invalid, form }) => (
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className='col-sm'>
                                    {this.renderField('width')}
                                </div>
                                <div className='col-sm'>
                                    {this.renderField('height')}
                                </div>
                            </div>
                            <PopupButtonsContainer>
                                <FormButtonsRow>
                                    <Button
                                        onClick={this.onCancel.bind(null, form.reset)}
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
                            {this.renderFormSpy(form)}
                        </form>
                    )}
                />
            </Popup>
        );
    }
}

MIResizePopup.propTypes = {
    widthInit: PropTypes.number,
    heightInit: PropTypes.number,
    onSubmit: PropTypes.func,
};

MIResizePopup.defaultProps = {
    widthInit: 0,
    heightInit: 0,
    onSubmit: null,
};

export default MIResizePopup;
