import { createAction } from 'redux-actions';
import { TScaleFactor } from '../../Shape/Shape';
import { ECursorTypes } from './shapesTypes';

export type TAddShape = () => void;
export const addShape = createAction('ADD_SHAPE');

export type TSetCursor = (cursor: ECursorTypes) => void;
export const setCursor = createAction('SET_CURSOR');

export type TSetStrokeColorToActiveShape = (hex: string) => void;
export const setStrokeColorToActiveShape = createAction('SET_STROKE_COLOR_TO_ACTIVE_SHAPE');

export type TSetStrokeWidthToActiveShape = (width: number) => void;
export const setStrokeWidthToActiveShape = createAction('SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');

export type TDeleteActiveShape = () => void;
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');

export type TBlurShapes = () => void;
export const blurShapes = createAction('BLUR_SHAPES');

export type TScaleShapes = (factor: TScaleFactor) => void;
export const scaleShapes = createAction('SCALE_SHAPES');
