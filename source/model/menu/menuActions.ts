import { createAction } from 'redux-actions';

export type TShowColorPicker = () => void;
export const showColorPicker = createAction('SHOW_COLOR_PICKER');

export type THideColorPicker = () => void;
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');

export type TSetStrokeWidth = (size: number) => void;
export const setStrokeWidth = createAction('SET_STROKE_WIDTH');

export type TSetStrokeColor = (color: string) => void;
export const setStrokeColor = createAction('SET_STROKE_COLOR');
