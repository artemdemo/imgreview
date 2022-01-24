import React, { useEffect, useRef, useState } from 'react';
import { FormGroup } from '../../../components/FormGroup/FormGroup';
import { FormInput } from '../../../components/FormInput/FormInput';
import PopupButtonsContainer from '../../../components/Popup/PopupButtonsContainer';
import FormButtonsRow from '../../../components/FormButtonsRow/FormButtonsRow';
import Button, { EButtonAppearance } from '../../../components/Button/Button';
import Popup from '../../../components/Popup/Popup';
import { getBody } from '../../../services/document';

type Props = {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  show: boolean;
  nameInit?: string;
};

export const MISavePopup: React.FC<Props> = (props) => {
  const { onCancel, onSubmit, nameInit = '', show } = props;
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [nameError, setNameError] = useState('');
  const nameInputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setName(nameInit);
      setTouched(false);
      setTimeout(() => {
        nameInputEl.current?.focus();
      });
    }
  }, [show]);

  useEffect(() => {
    if (name.replace(/\s/g, '') === '' && touched) {
      setNameError("Name can't be empty");
    } else {
      setNameError('');
    }
  }, [name]);

  const onPopupClose = () => {
    setName('');
    setNameError('');
    onCancel();
  };

  return (
    <Popup
      showCloseBtn={false}
      onClose={onPopupClose}
      show={show}
      base={getBody() || undefined}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(name);
        }}
      >
        <FormGroup errorText={nameError}>
          <label htmlFor="saveAs">Save as (*.png)</label>
          <FormInput
            placeholder="Enter file name"
            id="saveAs"
            value={name}
            ref={nameInputEl}
            onChange={(e) => {
              setName(e.target.value);
              setTouched(true);
            }}
          />
        </FormGroup>
        <PopupButtonsContainer>
          <FormButtonsRow>
            <Button onClick={onCancel} appearance={EButtonAppearance.SECONDARY}>
              Cancel
            </Button>
            <Button type="submit" disabled={nameError !== ''}>
              Save
            </Button>
          </FormButtonsRow>
        </PopupButtonsContainer>
      </form>
    </Popup>
  );
};
