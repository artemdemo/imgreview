import React from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

import './FormInput.less';

const keyMap = {
    enter: ['enter'],
};

class FormInput extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();

        this.keyHandlers = {
            enter: this.onSubmit,
        };
    }

    onSubmit = () => {
        const { onSubmit } = this.props;
        onSubmit && onSubmit();
    };

    select() {
        this.inputRef.current.select();
    }

    render() {
        return (
            <HotKeys
                keyMap={keyMap}
                handlers={this.keyHandlers}
            >
                <input
                    {...this.props}
                    className='form-input'
                    ref={this.inputRef}
                />
            </HotKeys>
        );
    }
}

FormInput.propTypes = {
    onSubmit: PropTypes.func,
};

FormInput.defaultProps = {
    onSubmit: null,
};

export default FormInput;
