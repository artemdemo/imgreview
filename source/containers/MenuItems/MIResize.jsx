import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { couldBeNumber } from '../../services/number';
import { updateImageSize } from '../../model/canvas/canvasActions';

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
        updateImageSize(
            Number(this.state.width),
            Number(this.state.height),
        );
    };

    updateSize(sizeKey, e) {
        const { value } = e.target;
        if (couldBeNumber(value)) {
            const numValue = Number(value);
            const secondSizeKey = sizeKey === 'width' ? 'height' : 'width';
            const ratio = this.state[`${secondSizeKey}Init`] / this.state[`${sizeKey}Init`];
            this.setState({
                [sizeKey]: value,
                [secondSizeKey]: Math.round(numValue * ratio),
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
    },
)(MIResize);
