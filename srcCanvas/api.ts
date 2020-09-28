/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import { createNanoEvents } from 'nanoevents';
import { createEvent } from './events/eventCreator';
import EShapeTypes from './Shape/shapeTypes';
import {TAddingShape} from './model/shapes/shapesModelTypes';

const emitter = createNanoEvents();

export type TImageData = {
    image: any;
    name: string;
};

export type TWHSize = {
    width: number;
    height: number;
};

export { default as EShapeTypes } from './Shape/shapeTypes';

// Emitting events
//

export type TCreateShape = {
    type: EShapeTypes;
    options?: any;
};
export const createShape = createEvent<TCreateShape>(emitter, 'CREATE_SHAPE');

export type TStartAddingShapeProps = {
    type: TAddingShape;
    options?: any;
};
export const startAddingShape = createEvent<TStartAddingShapeProps>(emitter, 'START_ADDING_SHAPE');

export type TSetImage = TImageData;
export const setImage = createEvent<TSetImage>(emitter, 'SET_IMAGE');

export type TSetStrokeColorToActiveShape = string;
export const setStrokeColorToActiveShape = createEvent<TSetStrokeColorToActiveShape>(emitter, 'SET_STROKE_COLOR_TO_ACTIVE_SHAPE');

export type TSetStrokeWidthToActiveShape = number;
export const setStrokeWidthToActiveShape = createEvent<TSetStrokeWidthToActiveShape>(emitter, 'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');

export type TSetFontSizeToActiveShape = number;
export const setFontSizeToActiveShape = createEvent<TSetFontSizeToActiveShape>(emitter, 'SET_FONT_SIZE_TO_ACTIVE_SHAPE');

export type TExportCanvasToImage = string;
export const exportCanvasToImage = createEvent<TExportCanvasToImage>(emitter, 'EXPORT_CANVAS_TO_IMAGE');

export const copyAllToClipboard = createEvent(emitter, 'COPY_ALL_TO_CLIPBOARD');

export type TUpdateCanvasSize = TWHSize
export const updateCanvasSize = createEvent<TUpdateCanvasSize>(emitter, 'UPDATE_CANVAS_SIZE');

export const blurShapes = createEvent(emitter, 'BLUR_SHAPES');

export const cropSelected = createEvent(emitter, 'CROP_SELECTED');

export const sketchifyActiveShape = createEvent(emitter, 'SKETCHIFY_ACTIVE_SHAPE');

// Create blank canvas, it's an easy way to test shapes,
// without opening an image
export type TInitBlankCanvas = TWHSize;
export const initBlankCanvas = createEvent<TInitBlankCanvas>(emitter, 'INIT_BLANK_CANVAS');

// Subscribing to events
//

export type TImageUpdated = TWHSize;
export const imageUpdated = createEvent<TImageUpdated>(emitter, 'IMAGE_UPDATED');

export type TShapeClicked = any;
export const shapeClicked = createEvent<TShapeClicked>(emitter, 'SHAPE_CLICKED');

export type TShapesBlurred = any;
export const shapesBlurred = createEvent<TShapesBlurred>(emitter, 'SHAPES_BLURRED');

export type TShapeAdded = any;
export const shapeAdded = createEvent<TShapeAdded>(emitter, 'SHAPE_ADDED');
