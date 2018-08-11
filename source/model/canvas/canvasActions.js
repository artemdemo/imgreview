import { createAction } from '../../services/actionCreator';

export const setStage = createAction('SET_STAGE', stage => ({ stage }));
export const addArrow = createAction('ADD_ARROW');
export const addImage = createAction('ADD_IMAGE', image => ({ image }));
export const saveCanvas = createAction('SAVE_CANVAS');
