import React from 'react';

import './FormInput.less';

const FormInput = (props) => {
    return (
        <input
            {...props}
            className='form-input'
        />
    );
};

export default FormInput;
