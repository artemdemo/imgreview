import { combineReducers } from 'redux';
import canvas from './model/canvas/canvasReducer';
import shapes from './model/shapes/shapesReducer';

export type TReduxState = {
    canvas: any,
    shapes: any;
};

const reducers = combineReducers({
    canvas,
    shapes,
});

export default reducers;
