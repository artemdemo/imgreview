import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'

type Props = {
    errorText?: string;
}

const FormGroupSty = styled.div`
    margin-bottom: 1rem;
`;

const FormGroupErrTextSty = styled.div`
    position: absolute;
    color: #f44336;
`;

class FormGroup extends React.PureComponent<Props> {
    static propTypes = {
        errorText: PropTypes.string,
    };

    static defaultProps = {
        errorText: '',
    };

    renderError() {
        if (this.props.errorText !== '') {
            return (
                <FormGroupErrTextSty>
                    {this.props.errorText}
                </FormGroupErrTextSty>
            );
        }
        return null;
    }

    render() {
        return (
            <FormGroupSty
                hasError={this.props.errorText !== ''}
            >
                {this.props.children}
                {this.renderError()}
            </FormGroupSty>
        );
    }
}

export default FormGroup;
