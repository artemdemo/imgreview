import React, { useContext } from 'react';
import { MsgBubble } from './MsgBubble';
import './Notifications.less';
import { AppStateContext } from '../../model/AppStateContext';

export enum NotificationType {
  Success,
  Error,
}

export type Notification = {
  type: NotificationType;
  message: string;
};

export const Notifications: React.FC = () => {
  const {
    state: { menu },
  } = useContext(AppStateContext);

  return (
    <div className="Notifications" style={{ top: `${menu.menuHeight}px` }}>
      <MsgBubble>aaa</MsgBubble>
    </div>
  );
};
