import { combineReducers } from 'redux';
import canvas, { TStateCanvas } from './model/canvas/canvasReducer';
import shapes, { TStateShapes } from './model/shapes/shapesReducer';

export type TReduxState = {
    canvas: TStateCanvas,
    shapes: TStateShapes;
};

const reducers = combineReducers({
    canvas,
    shapes,
});

export default reducers;
