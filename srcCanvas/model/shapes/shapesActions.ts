import { createAction } from 'redux-actions';

export const addShape = createAction('ADD_SHAPE');
export const setCursor = createAction('SET_CURSOR');
export const setStrokeColorToActiveShape = createAction('SET_STROKE_COLOR_TO_ACTIVE_SHAPE');
export const setStrokeWidthToActiveShape = createAction('SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');
export const setFontSizeToActiveShape = createAction('SET_FONT_SIZE_TO_ACTIVE_SHAPE');
export const deleteActiveShapes = createAction('DELETE_ACTIVE_SHAPES');
export const deleteAllShapes = createAction('DELETE_ALL_SHAPES');
export const deleteShape = createAction('DELETE_SHAPE');
export const blurShapes = createAction('BLUR_SHAPES');
export const scaleShapes = createAction('SCALE_SHAPES');
export const cropShapes = createAction('CROP_SHAPES');
export const setAddingShape = createAction('SET_ADDING_SHAPE');
