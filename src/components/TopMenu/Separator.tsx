import React from 'react';
import classnames from 'classnames';
import './Separator.css';

type Props = {
  show?: boolean;
};

export const Separator: React.FC<Props> = (props) => {
  const { show = true } = props;
  return (
    <span
      className={classnames({
        SeparatorWrapper: true,
        SeparatorWrapper_hide: !show,
      })}
    >
      <span className="Separator" />
    </span>
  );
};
