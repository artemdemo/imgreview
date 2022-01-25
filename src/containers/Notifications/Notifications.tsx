import React, { useContext, useEffect } from 'react';
import { MsgBubble } from './MsgBubble';
import { AppStateContext } from '../../model/AppStateContext';
import { removeNotification } from '../../model/notifications/notificationsActions';
import s from './Notifications.module.css';

const NOTIFICATION_TIMEOUT = 5000;

const Notifications: React.FC = () => {
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
    <div className={s.Notifications} style={{ top: `${menu.menuHeight}px` }}>
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

export default Notifications;
