import React from 'react';

import './FormInput.less';

type TProps = {
  placeholder: string;
  id: string;
};

class FormInput extends React.PureComponent<TProps> {
  private inputRef = React.createRef<HTMLInputElement>();

  /**
   * @public
   */
  focus() {
    this.inputRef.current?.focus();
  }

  render() {
    return <input {...this.props} className="form-input" ref={this.inputRef} />;
  }
}

export default FormInput;
