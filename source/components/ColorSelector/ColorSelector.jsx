import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import { setStroke } from '../../model/shapes/shapesActions';

import './ColorSelector.less';

class ColorSelector extends React.PureComponent {
    onChangeColor = (color) => {
        const { setStroke } = this.props;
        setStroke(color.hex);
    };

    render() {
        const { visible, shapes } = this.props;

        if (visible) {
            return (
                <ChromePicker
                    color={shapes.stroke}
                    onChange={this.onChangeColor}
                    className='color-selector'
                />
            );
        }

        return null;
    }
}

ColorSelector.propTypes = {
    visible: PropTypes.bool,
};

ColorSelector.defaultProps = {
    visible: true,
};

export default connect(
    state => ({
        shapes: state.shapes,
    }), {
        setStroke,
    },
)(ColorSelector);
