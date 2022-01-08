import { createAction } from 'redux-actions';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';

export const showColorPicker = createAction('SHOW_COLOR_PICKER');

export const setMenuHeight = createAction<number>('SET_MENU_HEIGHT');

export const toggleSubmenu = createAction<string>('TOGGLE_SUBMENU');

export const hideColorPicker = createAction('HIDE_COLOR_PICKER');

export const setStrokeWidth = createAction<number>('SET_STROKE_WIDTH');

export const setStrokeColor = createAction<string>('SET_STROKE_COLOR');

export const setFontSize = createAction<number>('SET_FONT_SIZE');

export type TSetShapeToAdd = (key?: EShapeTypes) => void;
export const setShapeToAdd = createAction('SET_SHAPE_TO_ADD');
