import { createAction } from 'redux-actions';
import { Notification, NotificationType } from './Notification';

export type ShowNotificationOptions = {
  type?: NotificationType;
  message: string;
};
export const showNotification =
  createAction<ShowNotificationOptions>('SHOW_NOTIFICATION');

export type RemoveNotificationOptions = Notification;
export const removeNotification = createAction<RemoveNotificationOptions>(
  'REMOVE_NOTIFICATION'
);
