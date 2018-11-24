/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { couldBeNumber } from '../../services/number';
import { updateImageSize } from '../../model/canvas/canvasActions';
import { blurShapes } from '../../model/shapes/shapesActions';

class MIResize extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            width: '0',
            widthInit: 0,
            height: '0',
            heightInit: 0,
        };

        this.popupRef = React.createRef();
    }

    onClick = () => {
        const { blurShapes } = this.props;
        blurShapes();
        this.popupRef.current.show();
    };

    onPopupOpen = () => {
        const { canvas } = this.props;
        const { width, height } = canvas.image.getSize();
        this.setState({
            width,
            height,
            widthInit: width,
            heightInit: height,
        });
    };

    onResize = () => {
        const { updateImageSize } = this.props;
        if (couldBeNumber(this.state.width) && couldBeNumber(this.state.height)) {
            const width = Number(this.state.width);
            const height = Number(this.state.height);
            if (width > 0 && height > 0) {
                updateImageSize(width, height);
                return true;
            }
        }
        return false;
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
                    buttons={[
                        {
                            className: 'btn btn-secondary',
                            text: 'Cancel',
                        },
                        {
                            className: 'btn btn-primary',
                            text: 'Resize',
                            onClick: this.onResize,
                        },
                    ]}
                    onOpen={this.onPopupOpen}
                    showCloseBtn={false}
                >
                    <div className='row'>
                        <div className='col-sm'>
                            <div className='form-group'>
                                <label htmlFor='img-width'>Width (px)</label>
                                <input
                                    className='form-control'
                                    placeholder='Enter width'
                                    value={this.state.width}
                                    onChange={this.updateSize.bind(this, 'width')}
                                    id='img-width'
                                />
                            </div>
                        </div>
                        <div className='col-sm'>
                            <div className='form-group'>
                                <label htmlFor='img-height'>Height (px)</label>
                                <input
                                    className='form-control'
                                    placeholder='Enter height'
                                    value={this.state.height}
                                    onChange={this.updateSize.bind(this, 'height')}
                                    id='img-height'
                                />
                            </div>
                        </div>
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
        updateImageSize,
        blurShapes,
    },
)(MIResize);
