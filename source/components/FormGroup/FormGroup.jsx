import React from 'react';

import './FormGroup.less';

const FormGroup = (props) => {
    return (
        <div className='form-group'>
            {props.children}
        </div>
    );
};

export default FormGroup;
