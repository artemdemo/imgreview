import { combineReducers } from 'redux';
import canvas from './model/canvas/canvasReducer';
import shapes from './model/shapes/shapesReducer';

const reducers = combineReducers({
    canvas,
    shapes,
});

export default reducers;
