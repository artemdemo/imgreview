import React from 'react';
import classnames from 'classnames';
import { NotificationType } from '../../model/notifications/Notification';
import s from './MsgBubble.module.css';

type Props = {
  type: NotificationType;
};

export const MsgBubble: React.FC<Props> = (props) => {
  const { children, type } = props;
  return (
    <div
      className={classnames({
        [s.MsgBubble]: true,
        [s.MsgBubble_success]: type === NotificationType.Success,
      })}
    >
      {children}
    </div>
  );
};
