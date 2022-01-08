/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import { Unsubscribe } from 'nanoevents';
import { TAddingShape } from '../model/shapes/shapesModelTypes';
import IShape from '../canvasShapes/Shape/IShape';
import { TPos } from 'konva';
import Shape from '../canvasShapes/Shape/Shape';
export { default as EShapeTypes } from '../canvasShapes/Shape/shapeTypes';

export type StartAddingShapeProps = {
  type: TAddingShape;
  options?: any;
};

export type SetImageProps = {
  image: any;
  name: string;
  pos?: TPos;
};

export type TWHSize = {
  width: number;
  height: number;
};

export type ShapeAddedProps = {
  addedShape: IShape;
};

export type ShapeDeletedProps = {
  deletedShape?: IShape;
};

export type OnCallback<T> = (payload: T) => void;
export type OnApi<T> = (cb: OnCallback<T>) => Unsubscribe;

export type CanvasAPI = {
  startAddingShape: (options: StartAddingShapeProps) => void;
  setImage: (props: SetImageProps) => void;
  setStrokeColorToActiveShape: (color: string) => void;
  setStrokeWidthToActiveShape: (width: number) => void;
  setFontSizeToActiveShape: (size: number) => void;
  exportCanvasToImage: (name: string) => void;
  copyAllToClipboard: () => void;
  blurShapes: () => void;
  sketchifyActiveShape: () => void;
  getShapesAmount: () => Promise<number>;
  initBlankCanvas: (props: TWHSize) => void;
  onShapeClicked: OnApi<IShape>;
  onShapeDragStarted: OnApi<IShape>;
  onShapesBlurred: OnApi<IShape>;
  onShapeAdded: OnApi<ShapeAddedProps>;
  onShapeDeleted: OnApi<ShapeDeletedProps>;
};

// Emitting events
//

// export const createShape = createEvent<{
//   type: EShapeTypes;
//   options?: any;
// }>(emitter, 'CREATE_SHAPE');
//
// export const startAddingShape = createEvent<{
//   type: TAddingShape;
//   options?: any;
// }>(emitter, 'START_ADDING_SHAPE');

// export const setImage = createEvent<SetImageProps>(emitter, 'SET_IMAGE');

// export const setStrokeColorToActiveShape = createEvent<string>(
//   emitter,
//   'SET_STROKE_COLOR_TO_ACTIVE_SHAPE',
// );

// export const setStrokeWidthToActiveShape = createEvent<number>(
//   emitter,
//   'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE',
// );

// export const setFontSizeToActiveShape = createEvent<number>(
//   emitter,
//   'SET_FONT_SIZE_TO_ACTIVE_SHAPE',
// );

// export const exportCanvasToImage = createEvent<string>(
//   emitter,
//   'EXPORT_CANVAS_TO_IMAGE',
// );

// export const copyAllToClipboard = createEvent(emitter, 'COPY_ALL_TO_CLIPBOARD');

// export const blurShapes = createEvent(emitter, 'BLUR_SHAPES');

// export const cropSelected = createEvent(emitter, 'CROP_SELECTED');

// export const sketchifyActiveShape = createEvent(
//   emitter,
//   'SKETCHIFY_ACTIVE_SHAPE',
// );

// Create blank canvas, it's an easy way to test shapes,
// without opening an image
// export const initBlankCanvas = createEvent<TWHSize>(
//   emitter,
//   'INIT_BLANK_CANVAS',
// );

// Subscribing to events
//

// export const shapeClicked = createEvent(emitter, 'SHAPE_CLICKED');

// export const shapeDragStarted = createEvent(emitter, 'SHAPE_DRAG_STARTED');

// export const shapesBlurred = createEvent<IShape>(emitter, 'SHAPES_BLURRED');

// export const shapeAdded = createEvent<{
//   addedShape: IShape;
//   shapesList: IShape[];
// }>(emitter, 'SHAPE_ADDED');

// export const shapeDeleted = createEvent<{
//   deletedShape?: IShape;
//   shapesList: IShape[];
// }>(emitter, 'SHAPE_DELETED');
