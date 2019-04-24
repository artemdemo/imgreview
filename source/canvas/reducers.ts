import { combineReducers } from 'redux';
import image, { TStateImage } from './model/image/imageReducer';
import stage, { TStateStage } from './model/stage/stageReducer';

export type TCanvasState = {
    image: TStateImage,
    stage: TStateStage;
};

const reducers = combineReducers({
    image,
    stage,
});

export default reducers;
