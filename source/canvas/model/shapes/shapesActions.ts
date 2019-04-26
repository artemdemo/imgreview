import { createAction } from 'redux-actions';

export type TAddArrow = () => void;
export const addArrow = createAction('ADD_ARROW');

export type TDeleteActiveShape = () => void;
export const deleteActiveShape = createAction('DELETE_ACTIVE_SHAPE');

export type TBlurShapes = () => void;
export const blurShapes = createAction('BLUR_SHAPES');
