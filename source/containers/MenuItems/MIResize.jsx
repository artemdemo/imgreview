import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
import MainMenuItem from '../../components/MainMenu/MainMenuItem';

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
        console.log(canvas);
    };

    onResize = () => {};

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
                            onChange={width => this.setState({ width })}
                            ref={this.nameRef}
                            id='img-width'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='img-height'>Height (px)</label>
                        <input
                            className='form-control'
                            placeholder='Enter height'
                            value={this.state.height}
                            onChange={height => this.setState({ height })}
                            ref={this.nameRef}
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
