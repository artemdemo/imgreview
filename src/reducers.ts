import { combineReducers } from 'redux';
import canvas, { TStateCanvas } from './model/canvas/canvasReducer';
import menu, { TStateMenu } from './model/menu/menuReducer';

export type TReduxState = {
  // ToDo: Looks like since I'm using infinite canvas -
  //   canvas state is not in use anymore.
  canvas: TStateCanvas;
  menu: TStateMenu;
};

const reducers = combineReducers({
  canvas,
  menu,
});

export default reducers;
