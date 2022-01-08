import React, { createContext, useReducer, useMemo } from 'react';
import _ from 'lodash';
import { GenericState, Store, combineReducers } from './combineReducers';
import {
  notificationsInitialState,
  notificationsReducer,
  NotificationsState,
} from './notifications/notificationsReducer';
import { menuInitialState, menuReducer, MenuState } from './menu/menuReducer';
import {
  CanvasState,
  canvasInitialState,
  canvasReducer,
} from './canvas/canvasReducer';

interface RootState extends GenericState {
  notifications: NotificationsState;
  menu: MenuState;
  canvas: CanvasState;
}
const rootInitialState: RootState = {
  notifications: notificationsInitialState,
  menu: menuInitialState,
  canvas: canvasInitialState,
};
const rootReducer = combineReducers<RootState>({
  notifications: notificationsReducer,
  menu: menuReducer,
  canvas: canvasReducer,
});

export const AppStateContext = createContext<Store<RootState>>({
  state: rootInitialState,
  dispatch: _.noop,
});

type StateProviderProps = {
  initialState?: RootState;
};

export const AppStateProvider: React.FC<StateProviderProps> = (props) => {
  const { children, initialState } = props;
  const [state, dispatch] = useReducer(
    rootReducer,
    initialState || rootInitialState,
  );
  const store = useMemo<Store<RootState>>(() => ({ state, dispatch }), [state]);
  return (
    <AppStateContext.Provider value={store}>
      {children}
    </AppStateContext.Provider>
  );
};
