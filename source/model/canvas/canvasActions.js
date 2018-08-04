import { createAction } from '../../services/actionCreator';

export const setContainer = createAction('SET_CONTAINER', containerEl => ({ containerEl }));
export const addImage = createAction('ADD_IMAGE', image => ({ image }));
export const addArrow = createAction('ADD_ARROW');
export const saveCanvas = createAction('SAVE_CANVAS');
