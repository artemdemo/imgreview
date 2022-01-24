import React from 'react';
import s from './PopupButtonsContainer.module.css';

const PopupButtonsContainer: React.FC = (props) => (
  <div className={s.PopupButtonsContainer}>{props.children}</div>
);

export default PopupButtonsContainer;
