import { createAction } from 'redux-actions';
import { TOneOfShapeTypes } from './shapesReducer';
import { ECursorTypes, ELayerTypes, TAddingShape } from './shapesModelTypes';
import Shape from '../../canvasShapes/Shape/Shape';
import { ChangeOrderActions } from '../../api/api-types';

export const addShape = createAction<TOneOfShapeTypes>('ADD_SHAPE');
export const setCursor = createAction<ECursorTypes>('SET_CURSOR');
export const setStrokeColorToActiveShape = createAction<string>(
  'SET_STROKE_COLOR_TO_ACTIVE_SHAPE',
);
export const setStrokeWidthToActiveShape = createAction<number>(
  'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE',
);
export const setFontSizeToActiveShape = createAction<number>(
  'SET_FONT_SIZE_TO_ACTIVE_SHAPE',
);
export const deleteActiveShapes = createAction<void>('DELETE_ACTIVE_SHAPES');
export const deleteAllShapes = createAction<void>('DELETE_ALL_SHAPES');
export const deleteShape = createAction<TOneOfShapeTypes>('DELETE_SHAPE');
export const blurShapes = createAction<Shape | void>('BLUR_SHAPES');
export const scaleShapes = createAction('SCALE_SHAPES');
export const cropShapes = createAction('CROP_SHAPES');
export const setAddingShape = createAction<{
  type: TAddingShape;
  options?: any;
} | void>('SET_ADDING_SHAPE');
export const shapeAdded = createAction<TOneOfShapeTypes>('SHAPE_ADDED');
export const drawLayers = createAction<ELayerTypes | void>('DRAW_LAYERS');
export const changeOrderOfActiveShape = createAction<ChangeOrderActions>('CHANGE_ORDER_OF_ACTIVE_SHAPE');
export const sketchifyActiveShape = createAction<void>(
  'SKETCHIFY_ACTIVE_SHAPE',
);
// export const unsketchifyActiveShape = createAction('UNSKETCHIFY_ACTIVE_SHAPE');
