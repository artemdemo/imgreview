/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
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

    onPopupOpen = () => {
        const { canvas } = this.props;
        const { width, height } = canvas.image.getSize();
        this.setState({
            width,
            height,
        });
    };

    onResize = () => {
        const { updateImageSize } = this.props;
        if (couldBeNumber(this.state.width) && couldBeNumber(this.state.height)) {
            const width = Number(this.state.width);
            const height = Number(this.state.height);
            if (width > 0 && height > 0) {
                updateImageSize({width, height});
                return true;
            }
        }
        return false;
    };

    onSubmit = (e, ...rest) => {
        console.log(rest);
    };

    updateSize(sizeKey, e) {
        const { value } = e.target;
        const secondSizeKey = sizeKey === 'width' ? 'height' : 'width';

        const calcSecondSize = () => {
            if (value === '') {
                return '';
            }
            const numValue = Number(value);
            const ratio = this.state[`${secondSizeKey}Init`] / this.state[`${sizeKey}Init`];
            return Math.round(numValue * ratio);
        };

        if (couldBeNumber(value) || value === '') {
            this.setState({
                [sizeKey]: value,
                [secondSizeKey]: calcSecondSize(),
            });
        }
    }

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
                        render={({ handleSubmit, invalid }) => (
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-sm'>
                                        <Field
                                            name='width'
                                            render={({ input, meta }) => (
                                                <FormGroup>
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
                                                <FormGroup>
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
                                        <Button secondary>
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
