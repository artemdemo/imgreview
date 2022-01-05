/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import { createNanoEvents } from 'nanoevents';
import { createEvent } from './events/eventCreator';
import EShapeTypes from './canvasShapes/Shape/shapeTypes';
import { TAddingShape } from './model/shapes/shapesModelTypes';
import IShape from './canvasShapes/Shape/IShape';
import { TPos } from 'konva';

const emitter = createNanoEvents();

export type TWHSize = {
  width: number;
  height: number;
};

export { default as EShapeTypes } from './canvasShapes/Shape/shapeTypes';

// Emitting events
//

export const createShape = createEvent<{
  type: EShapeTypes;
  options?: any;
}>(emitter, 'CREATE_SHAPE');

export const startAddingShape = createEvent<{
  type: TAddingShape;
  options?: any;
}>(emitter, 'START_ADDING_SHAPE');

export type SetImageData = {
  image: any;
  name: string;
  pos?: TPos;
};
export const setImage = createEvent<SetImageData>(emitter, 'SET_IMAGE');

export const setStrokeColorToActiveShape = createEvent<string>(
  emitter,
  'SET_STROKE_COLOR_TO_ACTIVE_SHAPE',
);

export const setStrokeWidthToActiveShape = createEvent<number>(
  emitter,
  'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE',
);

export const setFontSizeToActiveShape = createEvent<number>(
  emitter,
  'SET_FONT_SIZE_TO_ACTIVE_SHAPE',
);

export const exportCanvasToImage = createEvent<string>(
  emitter,
  'EXPORT_CANVAS_TO_IMAGE',
);

export const copyAllToClipboard = createEvent(emitter, 'COPY_ALL_TO_CLIPBOARD');

export const blurShapes = createEvent(emitter, 'BLUR_SHAPES');

export const cropSelected = createEvent(emitter, 'CROP_SELECTED');

export const sketchifyActiveShape = createEvent(
  emitter,
  'SKETCHIFY_ACTIVE_SHAPE',
);

// Create blank canvas, it's an easy way to test shapes,
// without opening an image
export const initBlankCanvas = createEvent<TWHSize>(
  emitter,
  'INIT_BLANK_CANVAS',
);

// Subscribing to events
//

export const shapeClicked = createEvent(emitter, 'SHAPE_CLICKED');

export const shapeDragStarted = createEvent(emitter, 'SHAPE_DRAG_STARTED');

export const shapesBlurred = createEvent<IShape>(emitter, 'SHAPES_BLURRED');

export const shapeAdded = createEvent<{
  addedShape: IShape;
  shapesList: IShape[];
}>(emitter, 'SHAPE_ADDED');

export const shapeDeleted = createEvent<{
  deletedShape?: IShape;
  shapesList: IShape[];
}>(emitter, 'SHAPE_DELETED');
