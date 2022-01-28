import React from 'react';
import s from './Container.module.css';

export const Container: React.FC = ({ children }) => (
  <div className={s.Container}>{children}</div>
);
