import React, { useContext, useEffect } from 'react';
import { MsgBubble } from './MsgBubble';
import './Notifications.less';
import { AppStateContext } from '../../model/AppStateContext';
import { removeNotification } from '../../model/notifications/notificationsActions';

const NOTIFICATION_TIMEOUT = 5000;

export const Notifications: React.FC = () => {
  const {
    state: { menu, notifications },
    dispatch,
  } = useContext(AppStateContext);

  useEffect(() => {
    const intervalToken = setInterval(() => {
      const currentTimestamp = +new Date();
      notifications.list.forEach((notification) => {
        if (
          currentTimestamp - Number(notification.created) >
          NOTIFICATION_TIMEOUT
        ) {
          dispatch(removeNotification(notification));
        }
      });
    }, 900);
    return () => {
      clearInterval(intervalToken);
    };
  }, [notifications]);

  return (
    <div className="Notifications" style={{ top: `${menu.menuHeight}px` }}>
      {notifications.list.map((notification) => (
        <MsgBubble
          type={notification.type}
          key={`${notification.message}-${notification.created}`}
        >
          {notification.message}
        </MsgBubble>
      ))}
    </div>
  );
};
