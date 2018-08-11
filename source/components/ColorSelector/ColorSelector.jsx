import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

import './ColorSelector.less';

class ColorSelector extends React.PureComponent {
    render() {
        const { visible } = this.props;

        if (visible) {
            return (
                <ChromePicker className='color-selector' />
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

export default ColorSelector;
