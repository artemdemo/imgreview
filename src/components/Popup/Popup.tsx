/* eslint-disable react/no-array-index-key */

import React, { CSSProperties, ReactElement } from 'react';
import Modal from '../Modal/Modal';
import PopupButtonsContainer from './PopupButtonsContainer';
import Button from '../Button/Button';
import FormButtonsRow from '../FormButtonsRow/FormButtonsRow';

import './Popup.less';

type ButtonProp = {
  text: string;
  className: string;
  type: string;
  disabled: boolean;
};

type Props = {
  onClose?: () => void;
  onOpen?: () => void;
  title?: string;
  showCloseBtn: boolean;
  contentIcon?: ReactElement;
  base?: Element;
  className?: string;
  style?: CSSProperties;
  hideClickOutside?: boolean;
  buttons?: ButtonProp | ButtonProp[];
};

class Popup extends React.PureComponent<Props> {
  private modalRef: any;
  private modalBgRef: any;

  constructor(props: Props) {
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
            type="button"
            className="popup-title-close"
          >
            ×
          </Button>
        );
      }
      return <span>&nbsp;</span>;
    })();
    const titleContent = (() => {
      if (title) {
        return <div className="popup-title-text">{title}</div>;
      }
      return <span>&nbsp;</span>;
    })();
    if (showCloseBtn || title) {
      return (
        <div className="popup-title">
          <div className="popup-title-section">{titleContent}</div>
          <div className="popup-title-section">{closeBtn}</div>
        </div>
      );
    }
    return null;
  }

  renderButtons() {
    const { buttons } = this.props;
    const onClickHandler = (btnProps: any) => () => {
      const noOnClick = !btnProps.hasOwnProperty('onClick');
      const onClickAllowHide =
        btnProps.hasOwnProperty('onClick') && btnProps.onClick() !== false;
      if (noOnClick || onClickAllowHide) {
        this.hide();
      }
    };
    if (buttons && (buttons as ButtonProp[]).length > 0) {
      return (
        <PopupButtonsContainer>
          <FormButtonsRow>
            {(buttons as ButtonProp[]).map((btnProps, index) => (
              <Button
                {...btnProps}
                key={`popup-button-${index}`}
                type="button"
                onClick={onClickHandler(btnProps)}
              >
                {btnProps.text}
              </Button>
            ))}
          </FormButtonsRow>
        </PopupButtonsContainer>
      );
    }
    if (buttons && (buttons as ButtonProp).text) {
      return (
        <PopupButtonsContainer>
          <Button {...buttons} type="button" onClick={onClickHandler(buttons)}>
            {(buttons as ButtonProp).text}
          </Button>
        </PopupButtonsContainer>
      );
    }
    return null;
  }

  renderContent() {
    const { contentIcon } = this.props;
    if (contentIcon) {
      return (
        <div className="popup-content">
          <div className="popup-content__icon">{contentIcon}</div>
          <div className="popup-content__text">{this.props.children}</div>
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
          baseClass="popup-bg"
          ref={this.modalBgRef}
          hideClickOutside={false}
          base={base}
        >
          <div />
        </Modal>
        <Modal
          className={className}
          baseClass="popup"
          ref={this.modalRef}
          style={style}
          hideClickOutside={hideClickOutside}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          base={base}
        >
          <div>
            {this.renderTitle()}
            <div className="popup-body">
              {this.renderContent()}
              {this.renderButtons()}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Popup;
