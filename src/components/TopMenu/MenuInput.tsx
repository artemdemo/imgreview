import React, { useState, useEffect, useRef } from 'react';
import s from './MenuInput.module.css';

type Props = {
  disabled?: boolean;
  displayValue: string;
  suffix?: string;
  onSubmit: (value: string) => void;
};

export const MenuInput: React.FC<Props> = (props) => {
  const { disabled, onSubmit, displayValue, suffix } = props;
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

  useEffect(() => {
    setValue(displayValue);
  }, [displayValue]);

  const renderSuffix = () => {
    return suffix ? ` ${suffix}` : '';
  };

  return (
    <>
      {!isEditing && (
        <span
          className={s.MenuInput}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {displayValue}
        </span>
      )}
      {isEditing && (
        <form
          className={s.MenuInputForm}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit(value);
            setIsEditing(false);
          }}
        >
          <input
            className={s.MenuInput}
            disabled={disabled}
            value={value}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              e.stopPropagation();
              setValue(e.target.value);
            }}
            ref={inputEl}
          />
        </form>
      )}
      {renderSuffix()}
    </>
  );
};

MenuInput.displayName = 'MenuInput';
