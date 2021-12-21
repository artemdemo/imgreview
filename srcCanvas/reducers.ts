import { combineReducers } from 'redux';
import stage, { TStateStage } from './model/stage/stageReducer';
import shapes, { TStateShapes } from './model/shapes/shapesReducer';

export type TCanvasState = {
  stage: TStateStage;
  shapes: TStateShapes;
};

const reducers = combineReducers({
  stage,
  shapes,
});

export default reducers;
