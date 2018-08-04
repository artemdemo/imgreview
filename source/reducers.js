import { combineReducers } from 'redux';
import canvas from './model/canvas/canvasReducer';

const reducers = combineReducers({
    canvas,
});

export default reducers;
