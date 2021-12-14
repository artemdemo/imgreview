import React, { useEffect, useState } from 'react';
import FormGroup from '../../../components/FormGroup/FormGroup';
import FormInput from '../../../components/FormInput/FormInput';
import PopupButtonsContainer from '../../../components/Popup/PopupButtonsContainer';
import FormButtonsRow from '../../../components/FormButtonsRow/FormButtonsRow';
import Button, { EButtonAppearance } from '../../../components/Button/Button';
import Popup from '../../../components/Popup/Popup';

type Props = {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  show: boolean;
  nameInit: string;
};

export const MISavePopup: React.FC<Props> = (props) => {
  const { onCancel, onSubmit, nameInit, show } = props;
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (show) {
      setName(nameInit);
    }
  }, [show]);

  useEffect(() => {
    if (name.replace(/\s/g, '') === '') {
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
    <Popup showCloseBtn={false} onClose={onPopupClose} show={show}>
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
            onChange={(e) => {
              setName(e.target.value);
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
