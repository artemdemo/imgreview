/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import isElement from '../../props/isElement';

import './Popup.less';

class Popup extends React.PureComponent {
    constructor(props) {
        super(props);

        this.modalRef = React.createRef();
        this.modalBgRef = React.createRef();
    }

    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
        this.modalBgRef.current.hide();
        this.modalRef.current.hide();
    };

    handleOpen = () => {
        const { onOpen } = this.props;
        onOpen && onOpen();
    };

    /**
     * @public
     */
    show() {
        this.modalRef.current.show();
        this.modalBgRef.current.show();
    }

    /**
     * @public
     */
    hide() {
        this.modalRef.current.hide();
        this.modalBgRef.current.hide();
    }

    renderTitle() {
        const { title, showCloseBtn } = this.props;
        const closeBtn = (() => {
            if (showCloseBtn) {
                return (
                    <Button
                        onClick={this.handleClose.bind(this)}
                        type='button'
                        className='popup-title-close'
                    >
                        ×
                    </Button>
                );
            }
            return (
                <span>&nbsp;</span>
            );
        })();
        const titleContent = (() => {
            if (title) {
                return (
                    <div className='popup-title-text'>
                        {title}
                    </div>
                );
            }
            return (
                <span>&nbsp;</span>
            );
        })();
        if (showCloseBtn || title) {
            return (
                <div className='popup-title'>
                    <div className='popup-title-section'>
                        {titleContent}
                    </div>
                    <div className='popup-title-section'>
                        {closeBtn}
                    </div>
                </div>
            );
        }
        return null;
    }

    renderButtons() {
        const { buttons } = this.props;
        const onClickHandler = btnProps => () => {
            const noOnClick = !btnProps.hasOwnProperty('onClick');
            const onClickAllowHide = btnProps.hasOwnProperty('onClick') && btnProps.onClick() !== false;
            if (noOnClick || onClickAllowHide) {
                this.hide();
            }
        };
        if (buttons && buttons.length > 0) {
            return (
                <div className='popup-buttons'>
                    {buttons.map((btnProps, index) => (
                        <div
                            className='popup-buttons__button-wrap'
                            key={`popup-buttons-${index}`}
                        >
                            <Button
                                {...btnProps}
                                type='button'
                                onClick={onClickHandler(btnProps)}
                            >
                                {btnProps.text}
                            </Button>
                        </div>
                    ))}
                </div>
            );
        }
        if (buttons) {
            return (
                <div className='popup-buttons'>
                    <Button
                        {...buttons}
                        type='button'
                        onClick={onClickHandler(buttons)}
                    >
                        {buttons.text}
                    </Button>
                </div>
            );
        }
        return null;
    }

    renderContent() {
        const { contentIcon } = this.props;
        if (contentIcon) {
            return (
                <div className='popup-content'>
                    <div className='popup-content__icon'>
                        {contentIcon}
                    </div>
                    <div className='popup-content__text'>
                        {this.props.children}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }

    render() {
        const { base, className, style, hideClickOutside } = this.props;
        return (
            <React.Fragment>
                <Modal
                    baseClass='popup-bg'
                    ref={this.modalBgRef}
                    hideClickOutside={false}
                    base={base}
                >
                    <div />
                </Modal>
                <Modal
                    className={className}
                    baseClass='popup'
                    ref={this.modalRef}
                    style={style}
                    hideClickOutside={hideClickOutside}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    base={base}
                >
                    <div>
                        {this.renderTitle()}
                        <div className='popup-body'>
                            {this.renderContent()}
                            {this.renderButtons()}
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const buttonProp = PropTypes.shape({
    text: PropTypes.text,
    className: PropTypes.text,
    type: PropTypes.text,
    disabled: PropTypes.bool,
});

Popup.propTypes = {
    // eslint-disable-next-line react/no-typos
    base: isElement,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.shape({}),
    buttons: PropTypes.oneOfType([
        buttonProp,
        PropTypes.arrayOf(buttonProp),
    ]),
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    hideClickOutside: PropTypes.bool,
    showCloseBtn: PropTypes.bool,
    contentIcon: PropTypes.element,
};

Popup.defaultProps = {
    base: null,
    title: null,
    className: null,
    style: null,
    buttons: null,
    onClose: null,
    onOpen: null,
    hideClickOutside: false,
    showCloseBtn: true,
    contentIcon: null,
};

export default Popup;
