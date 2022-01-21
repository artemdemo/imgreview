import React from 'react';
import classnames from 'classnames';
import { NotificationType } from '../../model/notifications/Notification';
import './MsgBubble.css';

type Props = {
  type: NotificationType;
};

export const MsgBubble: React.FC<Props> = (props) => {
  const { children, type } = props;
  return (
    <div
      className={classnames({
        MsgBubble: true,
        MsgBubble_success: type === NotificationType.Success,
      })}
    >
      {children}
    </div>
  );
};
