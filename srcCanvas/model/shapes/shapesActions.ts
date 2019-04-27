import { createAction } from 'redux-actions';
import { TScaleFactor } from '../../Shape/Shape';
import { ECursorTypes } from './shapesTypes';

export type TAddArrow = () => void;
export const addArrow = createAction('ADD_ARROW');

export type TSetCursor = (cursor: ECursorTypes) => void;
export const setCursor = createAction('SET_CURSOR');

export type TDeleteActiveShape = () => void;
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');

export type TBlurShapes = () => void;
export const blurShapes = createAction('BLUR_SHAPES');

export type TScaleShapes = (factor: TScaleFactor) => void;
export const scaleShapes = createAction('SCALE_SHAPES');
