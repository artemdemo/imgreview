import { combineReducers } from 'redux';
import image, { TStateImage } from './model/image/imageReducer';
import stage, { TStateStage } from './model/stage/stageReducer';
import shapes, { TStateShapes } from './model/shapes/shapesReducer';

export type TCanvasState = {
  image: TStateImage;
  stage: TStateStage;
  shapes: TStateShapes;
};

const reducers = combineReducers({
  image,
  stage,
  shapes,
});

export default reducers;
