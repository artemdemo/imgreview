import React from 'react';

import './FormInput.less';

class FormInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    /**
     * @public
     */
    focus() {
        this.inputRef.current.focus();
    }

    render() {
        return (
            <input
                {...this.props}
                className='form-input'
                ref={this.inputRef}
            />
        );
    }
}

export default FormInput;
