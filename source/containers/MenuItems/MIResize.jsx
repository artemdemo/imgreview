import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';
import { couldBeNumber } from '../../services/number';

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
        const { canvas } = this.props;
        canvas.image.setSize(
            this.state.width,
            this.state.height,
        );
    };

    updateSize(sizeKey, e) {
        const { value } = e.target;
        if (couldBeNumber(value)) {
            this.setState({
                [sizeKey]: Number(value),
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
                </Popup>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        canvas: state.canvas,
    }),
)(MIResize);
