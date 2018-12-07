import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './FormGroup.less';

class FormGroup extends React.PureComponent {
    renderError() {
        if (this.props.errorText) {
            return (
                <div className='form-group-error-text'>
                    {this.props.errorText}
                </div>
            );
        }
        return null;
    }

    render() {
        const groupClass = classnames({
            'form-group': true,
            'form-group_has-error': this.props.errorText,
        });
        return (
            <div className={groupClass}>
                {this.props.children}
                {this.renderError()}
            </div>
        );
    }
}

FormGroup.propTypes = {
    errorText: PropTypes.string,
};

FormGroup.defaultProps = {
    errorText: null,
};

export default FormGroup;
