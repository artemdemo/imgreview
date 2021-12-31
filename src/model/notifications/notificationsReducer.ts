import { GenericState, Reducer } from '../combineReducers';
import * as actions from './notificationsActions';
import { Notification } from './Notification';
import {RemoveNotificationOptions, ShowNotificationOptions} from './notificationsActions';

export interface NotificationsState extends GenericState {
  list: Notification[];
}

export const notificationsInitialState: NotificationsState = {
  list: [],
};

export const notificationsReducer: Reducer<NotificationsState> = (
  state = notificationsInitialState,
  action
) => {
  switch (action.type) {
    case `${actions.showNotification}`:
      const showOptions: ShowNotificationOptions = action.payload;
      return {
        ...state,
        list: [...state.list, new Notification(showOptions)],
      };
    case `${actions.removeNotification}`:
      const notificationToRemove: RemoveNotificationOptions = action.payload;
      return {
        ...state,
        list: state.list.filter((item) => item !== notificationToRemove),
      };
    default:
      return state;
  }
};
