import React from 'react';
import './PopupButtonsContainer.css';

const PopupButtonsContainer: React.FC = (props) => (
  <div className="popup-buttons-container">{props.children}</div>
);

export default PopupButtonsContainer;
