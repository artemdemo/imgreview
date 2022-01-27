import React from 'react';
import s from './Tips.module.css';

export const Tips: React.FC = () => {
  return (
    <div className={s.Tips}>
      Psst...<br />
      You can add as many images as you want here.<br />
      If you want to read more about the features click here.<br />
    </div>
  )
};
