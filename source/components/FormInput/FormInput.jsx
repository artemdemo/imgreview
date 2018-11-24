import React from 'react';

import './FormInput.less';

class FormInput extends React.PureComponent {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    select() {
        this.inputRef.current.select();
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
