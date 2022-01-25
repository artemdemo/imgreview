import React from 'react';
import classnames from 'classnames';
import s from './Separator.module.css';

type Props = {
  show?: boolean;
};

export const Separator: React.FC<Props> = (props) => {
  const { show = true } = props;
  return (
    <span
      className={classnames({
        [s.SeparatorWrapper]: true,
        [s.SeparatorWrapper_hide]: !show,
      })}
    >
      <span className={s.Separator} />
    </span>
  );
};
