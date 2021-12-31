import { Action, GenericState, Reducer } from '../combineReducers';
import * as actions from './notificationsActions';

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
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    default:
      return state;
  }
};
