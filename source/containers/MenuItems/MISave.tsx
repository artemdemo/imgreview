/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for,react/no-unused-state */
import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { TReduxState } from '../../reducers';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import FormGroup from '../../components/FormGroup/FormGroup';
import FormInput from '../../components/FormInput/FormInput';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import Button from '../../components/Button/Button';
import FormButtonsRow from '../../components/FormButtonsRow/FormButtonsRow';
import PopupButtonsContainer from '../../components/Popup/PopupButtonsContainer';
import { saveCanvas, TSaveCanvas } from '../../model/canvas/canvasActions';
import { TStateCanvas } from '../../model/canvas/canvasReducer';

type Props = {
    canvas: TStateCanvas;
    showColorPicker: () => void;
    saveCanvas: TSaveCanvas
};

class MISave extends React.PureComponent<Props> {
    private readonly popupRef: any;
    private readonly nameRef: any;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };
        this.popupRef = React.createRef();
        this.nameRef = React.createRef();
    }

    onCancel = () => {
        this.popupRef.current.hide();
    };

    onClick = () => {
        const { canvas } = this.props;
        this.setState({
            name: canvas.imageOriginName,
        }, () => {
            this.popupRef.current.show();
        });
    };

    onPopupOpen = () => {
        this.nameRef.current.focus();
    };

    onSubmit = (values) => {
        const { saveCanvas } = this.props;
        const { name } = values;
        if (name !== '') {
            saveCanvas(name.trim());
            this.setState({
                name: '',
            });
            this.popupRef.current.hide();
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
                    onSubmit={this.onSubmit}
                    showCloseBtn={false}
                    onOpen={this.onPopupOpen}
                >
                    <Form
                        initialValues={this.state}
                        onSubmit={this.onSubmit}
                        validate={(values: any) => {
                            const errors: any = {};
                            if (!values.name || values.name.replace(/\s/g, '') === '') {
                                errors.name = 'Name can\'t be empty';
                            }
                            return errors;
                        }}
                        render={({ handleSubmit, invalid }) => (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name='name'
                                    render={({ input, meta }) => (
                                        <FormGroup
                                            errorText={meta.error}
                                        >
                                            <label htmlFor='saveAs'>Save as (*.png)</label>
                                            <FormInput
                                                placeholder='Enter file name'
                                                id='saveAs'
                                                ref={this.nameRef}
                                                {...input}
                                            />
                                        </FormGroup>
                                    )}
                                />
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
                                            Save
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
    (state: TReduxState) => ({
        canvas: state.canvas,
    }), {
        saveCanvas,
    },
)(MISave);
