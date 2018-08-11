import { createAction } from '../../services/actionCreator';

export const addArrow = createAction('ADD_ARROW', arrow => ({ arrow }));
export const setStroke = createAction('SET_STROKE', stroke => ({ stroke }));
export const blurShapes = createAction('BLUR_SHAPES');
