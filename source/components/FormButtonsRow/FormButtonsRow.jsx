import React from 'react';

import './FormButtonsRow.less';

const FormButtonsRow = props => (
    <React.Fragment>
        {React.Children.map(props.children, child => (
            <div className='form-buttons-row-child'>
                {child}
            </div>
        ))}
    </React.Fragment>
);

export default FormButtonsRow;
