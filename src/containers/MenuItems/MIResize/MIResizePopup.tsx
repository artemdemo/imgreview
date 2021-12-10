/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
import React, { useRef, useReducer, useEffect } from 'react';
import FormGroup from '../../../components/FormGroup/FormGroup';
import FormInput from '../../../components/FormInput/FormInput';
import PopupButtonsContainer from '../../../components/Popup/PopupButtonsContainer';
import FormButtonsRow from '../../../components/FormButtonsRow/FormButtonsRow';
import Button, { EButtonAppearance } from '../../../components/Button/Button';
import Popup from '../../../components/Popup/Popup';
import { couldBeNumber } from '../../../services/number';

type Props = {
  onSubmit: (...rest) => void;
  onCancel: () => void;
  widthInit: number;
  heightInit: number;
  show: boolean;
};

function valuesReducer(state, action) {
  switch (action.type) {
    case 'width':
      return {
        ...state,
        width: action.data,
        // height: Math.round(Number(action.data) * state.ratioInit),
      };
    case 'height':
      return {
        ...state,
        height: action.data,
        // width: Math.round(Number(action.data) * state.ratioInit),
      };
    case 'ratioInit':
      return {
        ...state,
        ratioInit: action.data,
      };
    default:
      return state;
  }
}

function errorsReducer(state, action) {
  switch (action.type) {
    case 'widthError':
      return {
        ...state,
        widthError: action.data,
      };
    case 'heightError':
      return {
        ...state,
        heightError: action.data,
      };
    default:
      return state;
  }
}

const MIResizePopup: React.FC<Props> = (props) => {
  const { onSubmit, onCancel, widthInit, heightInit, show } = props;
  const popupRef = useRef<Popup>(null);
  const [valuesState, dispatchValues] = useReducer(valuesReducer, {
    width: 0,
    height: 0,
    ratioInit: 1,
  });
  const [errorsState, dispatchErrors] = useReducer(errorsReducer, {
    widthError: '',
    heightError: '',
  });

  useEffect(() => {
    if (show) {
      popupRef.current?.show();
      dispatchValues({ type: 'width', data: widthInit });
      dispatchValues({ type: 'height', data: heightInit });
      dispatchValues({ type: 'ratioInit', data: widthInit / heightInit });
    } else {
      popupRef.current?.hide();
    }
  }, [show]);

  useEffect(() => {
    const errors: { [key: string]: string } = {};
    const fields = ['width', 'height'];
    fields.forEach((field) => {
      if (!couldBeNumber(valuesState[field])) {
        errors[field] = 'Must be a number';
      } else if (Number(valuesState[field]) < 80) {
        errors[field] = 'Value is too small';
      } else if (Number(valuesState[field]) > 5000) {
        errors[field] = 'Value is too big';
      }
    });
    dispatchErrors({ type: 'widthError', data: errors.width || '' });
    dispatchErrors({ type: 'heightError', data: errors.height || '' });
  }, [valuesState]);

  const renderField = (fieldKey: string) => {
    return (
      <FormGroup errorText={errorsState[`${fieldKey}Error`]}>
        <label htmlFor={`img-${fieldKey}`}>{fieldKey} (px)</label>
        <FormInput
          placeholder={`Enter ${fieldKey}`}
          value={valuesState[fieldKey]}
          onChange={(e) => {
            const { value } = e.target;
            dispatchValues({ type: fieldKey, data: value });
          }}
          id={`img-${fieldKey}`}
        />
      </FormGroup>
    );
  };

  return (
    <Popup title="Resize image" ref={popupRef} showCloseBtn={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ width: valuesState.width, height: valuesState.height });
        }}
      >
        <div className="row">
          <div className="col-sm">{renderField('width')}</div>
          <div className="col-sm">{renderField('height')}</div>
        </div>
        <PopupButtonsContainer>
          <FormButtonsRow>
            <Button onClick={onCancel} appearance={EButtonAppearance.SECONDARY}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                errorsState.widthError !== '' || errorsState.heightError !== ''
              }
            >
              Resize
            </Button>
          </FormButtonsRow>
        </PopupButtonsContainer>
      </form>
    </Popup>
  );
};

export default MIResizePopup;
