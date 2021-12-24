import EShapeTypes from '../../canvasShapes/Shape/shapeTypes';

export enum ECursorTypes {
  AUTO = 'auto',
  MOVE = 'move',
  POINTER = 'pointer',
  GRAB = 'grab',
}

export enum ELayerTypes {
  SHAPES_LAYER = 'shapes_layer',
  ANCHORS_LAYER = 'anchors_layer',
}

export type TAddingShape = EShapeTypes | null;
