import { createAction } from '../../services/actionCreator';

export const setStage = createAction('SET_STAGE', stage => ({ stage }));
export const addImage = createAction('ADD_IMAGE', (image, name) => ({ image, name }));
export const saveCanvas = createAction('SAVE_CANVAS', fileName => ({ fileName }));
export const setCursor = createAction('SET_CURSOR', cursor => ({ cursor }));
