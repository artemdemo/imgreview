import { combineReducers } from 'redux';
import canvas from './model/canvas/canvasReducer';
import shapes, { TShapes } from './model/shapes/shapesReducer';

export type TReduxState = {
    canvas: any,
    shapes: TShapes;
};

const reducers = combineReducers({
    canvas,
    shapes,
});

export default reducers;
