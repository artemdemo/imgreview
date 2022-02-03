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
    <div
      className={s.Notifications}
      style={{ top: `${menu.menuHeight + 3}px` }}
    >
      {notifications.list.map((notification) => (
        <div
          className={s.Notifications__Item}
          key={`${notification.message}-${notification.created}`}
        >
          <MsgBubble
            type={notification.type}
          >
            {notification.message}
          </MsgBubble>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
