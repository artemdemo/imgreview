import { createAction } from 'redux-actions';

export const setStage = createAction('SET_STAGE');
export const addImage = createAction('ADD_IMAGE');
export const saveCanvas = createAction('SAVE_CANVAS');
export const setCursor = createAction('SET_CURSOR');

export type TUpdateImageSize = (prop: { width: number, height: number }) => void;
export const updateImageSize = createAction('UPDATE_IMAGE');
