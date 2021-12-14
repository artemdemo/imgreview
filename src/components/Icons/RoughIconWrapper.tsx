import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const RoughIconWrapper: React.FC = (props) => {
  return (
    <span className="fa-layers fa-fw">
      {props.children}
      <FontAwesomeIcon icon={faPencilAlt} transform="shrink-5 right-6" />
    </span>
  );
};

export default RoughIconWrapper;
