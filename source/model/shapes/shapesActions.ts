import { createAction } from 'redux-actions';

export const addArrow = createAction('ADD_ARROW');
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');
export const showColorPicker = createAction('SHOW_COLOR_PICKER');
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');
export const copyActiveShapes = createAction('COPY_ACTIVE_SHAPES');

export type TBlurShapes = () => void;
export const blurShapes = createAction('BLUR_SHAPES');

export type TSetStrokeWidth = (size: number) => void;
export const setStrokeWidth = createAction('SET_STROKE_WIDTH');

export type TSetStrokeColor = (color: string) => void;
export const setStrokeColor = createAction('SET_STROKE_COLOR');
