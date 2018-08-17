import React from 'react';
import { connect } from 'react-redux';
import Icon from '../../components/Icon/Icon';
import Popup from '../../components/Popup/Popup';
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
    }

    onClick = () => {
        const { blurShapes } = this.props;
        blurShapes();
        this.popupRef.current.show();
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
                    />
                </MainMenuItem>
                <Popup
                    ref={this.popupRef}
                    buttons={[
                        {
                            className: 'btn btn-secondary',
                            text: 'Cancel',
                        },
                        {
                            className: 'btn btn-primary',
                            text: 'Save',
                            onClick: () => {
                                const { saveCanvas } = this.props;
                                const { name } = this.state;
                                if (name !== '') {
                                    saveCanvas(name);
                                    this.setState({
                                        name: '',
                                    });
                                }
                            },
                        },
                    ]}
                    showCloseBtn={false}
                >
                    <div className='form-group'>
                        <label htmlFor='saveAs'>Save as (*.png)</label>
                        <input
                            className='form-control'
                            placeholder='Enter file name'
                            value={this.state.name}
                            onChange={this.updateValue}
                            id='saveAs'
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
    }), {
        blurShapes,
        saveCanvas,
    },
)(MISave);
