import { createAction } from '../../services/actionCreator';

export const addArrow = createAction('ADD_ARROW', arrow => ({ arrow }));
export const setStroke = createAction('SET_STROKE', stroke => ({ stroke }));
export const blurShapes = createAction('BLUR_SHAPES', exceptShape => ({ exceptShape }));
export const showColorPicker = createAction('SHOW_COLOR_PICKER');
export const hideColorPicker = createAction('HIDE_COLOR_PICKER');
