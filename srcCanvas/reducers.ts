import { combineReducers } from 'redux';
import stage, { TStateStage } from './model/stage/stageReducer';
import shapes, { TStateShapes } from './model/shapes/shapesReducer';
import saveCanvas, {
  TSaveCanvasStage,
} from './model/saveCanvas/saveCanvasReducer';

export type TCanvasState = {
  stage: TStateStage;
  shapes: TStateShapes;
  saveCanvas: TSaveCanvasStage;
};

const reducers = combineReducers({
  stage,
  shapes,
  saveCanvas,
});

export default reducers;
