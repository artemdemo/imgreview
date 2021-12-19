import { combineReducers } from 'redux';
import menu, { TStateMenu } from './model/menu/menuReducer';

export type TReduxState = {
  menu: TStateMenu;
};

const reducers = combineReducers({
  menu,
});

export default reducers;
