import { createAction } from 'redux-actions';

export type TShowColorPicker = () => void;
export const showColorPicker = createAction('SHOW_COLOR_PICKER');

export type TSetMenuHeight = (height: number) => void;
export const setMenuHeight = createAction('SET_MENU_HEIGHT');

export type TToggleSubmenu = (menuName: string) => void;
export const toggleSubmenu = createAction('TOGGLE_SUBMENU');

export type THideColorPicker = () => void;
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');

export type TSetStrokeWidth = (size: number) => void;
export const setStrokeWidth = createAction('SET_STROKE_WIDTH');

export type TSetStrokeColor = (color: string) => void;
export const setStrokeColor = createAction('SET_STROKE_COLOR');
