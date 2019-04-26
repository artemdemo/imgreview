import { createAction } from 'redux-actions';

export type TShowColorPicker = () => void;
export const showColorPicker = createAction('SHOW_COLOR_PICKER');

export type THideColorPicker = () => void;
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');
