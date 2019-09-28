import React from 'react';
import PropTypes from 'prop-types';
import _isString from 'lodash/isString';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import isElement from '../../props/isElement';
import ModalClickOutside from './ModalClickOutside';

import './Modal.less';

/**
 * This is base <Modal /> element for other "popup like" elements.
 * It provides only basic functionality.
 */
class Modal extends React.PureComponent {
    constructor(props) {
        super(props);

        // In same `base` could appear more than one Modals,
        // Therefore it make sense to separate them.
        // (This variable will be used only if "base" is defined before mounting)
        this.modalWrapEl = null;

        this.state = {
            entering: false,
            open: false,
            leaving: false,
            style: null,
        };

        this.modalBaseRef = React.createRef();
    }

    componentWillMount() {
        const { base } = this.props;
        this.mountBase(base);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.style !== nextProps.style && !this.state.leaving) {
            // I don't want to change style if modal is leaving.
            // User could set `top` and `left`
            // And this styles could change, while modal is leaving the stage
            // It will case not desired "jump" of modal just before disappearing
            this.setState({
                style: nextProps.style,
            });
        }
        if (this.props.base !== nextProps.base) {
            this.mountBase(nextProps.base);
        }
    }

    componentWillUnmount() {
        const { base } = this.props;
        if (base && this.modalWrapEl) {
            base.removeChild(this.modalWrapEl);
        }
    }

    onClickOutside() {
        const { onClose } = this.props;
        if (!this.state.entering && this.state.open) {
            this.hide();
            onClose && onClose();
        }
    }

    mountBase(base) {
        if (base) {
            if (this.modalWrapEl) {
                base.removeChild(this.modalWrapEl);
            }
            this.modalWrapEl = document.createElement('div');
            base.appendChild(this.modalWrapEl);
        }
    }

    /**
     * @public
     */
    show() {
        this.setState({
            entering: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    open: true,
                });
            });
        });
    }

    /**
     * @public
     */
    hide() {
        if (this.state.open && !this.state.leaving) {
            this.setState({
                leaving: true,
            });
        }
    }

    handleTransitionEnd(e) {
        // `handleTransitionEnd` is catching transitionEnd events from all child nodes
        // I'm not interested in that
        if (e.target === this.modalBaseRef.current) {
            if (this.state.entering) {
                this.setState({
                    entering: false,
                });
            }
            if (this.state.leaving) {
                this.setState({
                    open: false,
                    leaving: false,
                });
            }
            if (this.state.open) {
                const { onOpen } = this.props;
                onOpen && onOpen();
            }
        }
    }

    renderContent() {
        const { hideClickOutside } = this.props;
        if (hideClickOutside) {
            return (
                <ModalClickOutside
                    onClickOutside={this.onClickOutside.bind(this)}
                >
                    {this.props.children}
                </ModalClickOutside>
            );
        }
        return this.props.children;
    }

    render() {
        const { base, baseClass, className } = this.props;
        if (!_isString(baseClass) || baseClass.replace(/\s+/, ' ').split(' ').length > 1) {
            throw new Error('baseClass may contain one class at most');
        }
        const modalClass = classnames(baseClass, className, {
            [`${baseClass}_entering`]: this.state.entering,
            [`${baseClass}_open`]: this.state.open,
            [`${baseClass}_leaving`]: this.state.leaving,
        });
        const modal = (
            <div
                style={this.state.style}
                className={modalClass}
                onTransitionEnd={this.handleTransitionEnd.bind(this)}
                ref={this.modalBaseRef}
            >
                {this.renderContent()}
            </div>
        );
        if (base) {
            return createPortal(
                modal,
                this.modalWrapEl
            );
        }
        return modal;
    }
}

Modal.propTypes = {
    // eslint-disable-next-line react/no-typos
    base: isElement,
    baseClass: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.shape({}),
    hideClickOutside: PropTypes.bool,
    onOpen: PropTypes.func,
    /*
     * onClose callback will be called only when modal is closed by click outside
     * otherwise it may cause stack overflow
     */
    onClose: PropTypes.func,
};

Modal.defaultProps = {
    base: null,
    baseClass: 'modal',
    className: null,
    style: null,
    hideClickOutside: true,
    onOpen: null,
    onClose: null,
};

export default Modal;
