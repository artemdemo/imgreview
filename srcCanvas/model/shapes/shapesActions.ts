import { createAction } from 'redux-actions';
import { TScaleProps } from '../../Shape/IShape';
import { ECursorTypes } from './shapesTypes';

export type TAddShape = () => void;
export const addShape = createAction('ADD_SHAPE');

export type TSetCursor = (cursor: ECursorTypes) => void;
export const setCursor = createAction('SET_CURSOR');

export type TSetStrokeColorToActiveShape = (hex: string) => void;
export const setStrokeColorToActiveShape = createAction('SET_STROKE_COLOR_TO_ACTIVE_SHAPE');

export type TSetStrokeWidthToActiveShape = (width: number) => void;
export const setStrokeWidthToActiveShape = createAction('SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');

export type TSetFontSizeToActiveShape = (fontSize: number) => void;
export const setFontSizeToActiveShape = createAction('SET_FONT_SIZE_TO_ACTIVE_SHAPE');

export type TDeleteActiveShape = () => void;
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');

export type TDeleteAllShape = () => void;
export const deleteAllShape = createAction('DELETE_ALL_SHAPE');

export type TBlurShapes = () => void;
export const blurShapes = createAction('BLUR_SHAPES');

export type TScaleShapes = (scaleProps: TScaleProps) => void;
export const scaleShapes = createAction('SCALE_SHAPES');
