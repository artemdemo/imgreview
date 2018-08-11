import React from 'react';
import onClickOutside from 'react-click-outside';
import PropTypes from 'prop-types';

class ModalClickOutside extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClickOutside() {
        const { onClickOutside } = this.props;
        onClickOutside();
    }

    render() {
        return this.props.children;
    }
}

ModalClickOutside.propTypes = {
    onClickOutside: PropTypes.func.isRequired,
};

export default onClickOutside(ModalClickOutside);
