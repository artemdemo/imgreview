import React, { ButtonHTMLAttributes } from 'react';
import PopupButtonsContainer from './PopupButtonsContainer';
import FormButtonsRow from '../FormButtonsRow/FormButtonsRow';
import Button from '../Button/Button';

export interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

type Props = {
  buttons: ButtonProp | ButtonProp[];
};

export const PopupButtons: React.FC<Props> = (props) => {
  const { buttons } = props;

  if (buttons && (buttons as ButtonProp[]).length > 0) {
    return (
      <PopupButtonsContainer>
        <FormButtonsRow>
          {(buttons as ButtonProp[]).map((btnProps, index) => (
            <Button {...btnProps} key={`popup-button-${index}`} type="button">
              {btnProps.text}
            </Button>
          ))}
        </FormButtonsRow>
      </PopupButtonsContainer>
    );
  }

  const _buttons = buttons as ButtonProp;

  return (
    <PopupButtonsContainer>
      <Button {..._buttons} type="button">
        {_buttons.text}
      </Button>
    </PopupButtonsContainer>
  );
};
