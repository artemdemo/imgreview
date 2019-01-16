import { createAction } from 'redux-actions';

export const addArrow = createAction('ADD_ARROW');
export const setStroke = createAction('SET_STROKE');
export const blurShapes = createAction('BLUR_SHAPES');
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');
export const showColorPicker = createAction('SHOW_COLOR_PICKER');
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');
export const copyActiveShapes = createAction('COPY_ACTIVE_SHAPES');
