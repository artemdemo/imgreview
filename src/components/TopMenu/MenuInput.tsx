import React, { useState, useEffect, useRef } from 'react';
import './MenuInput.less';

type Props = {
  disabled?: boolean;
  displayValue: string;
  onSubmit: (value: string) => void;
};

export const MenuInput: React.FC<Props> = (props) => {
  const { disabled, onSubmit, displayValue } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        inputEl.current?.focus();
        setValue(displayValue);
      });
    }
  }, [isEditing]);

  return (
    <>
      {!isEditing && (
        <span
          className="MenuInput"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {displayValue}
        </span>
      )}
      {isEditing && (
        <form
          className="MenuInputForm"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value);
            setIsEditing(false);
          }}
        >
          <input
            className="MenuInput"
            disabled={disabled}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            ref={inputEl}
          />
        </form>
      )}
    </>
  );
};
