/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import { createNanoEvents } from "nanoevents";
import { createEvent } from "./events/eventCreator";
import EShapeTypes from "./Shape/shapeTypes";

const emitter = createNanoEvents();

export type TImageData = {
    image: any;
    name: string;
};

export type TWHSize = {
    width: number;
    height: number;
};

export { default as EShapeTypes } from "./Shape/shapeTypes";

// Emitting events
//

export const createShape: (type: EShapeTypes, options?: any) => void = createEvent(emitter, 'CREATE_SHAPE');

export const startAddingShape: (type: EShapeTypes) => void = createEvent(emitter, 'START_ADDING_SHAPE');

export const setImage: (data: TImageData) => void = createEvent(emitter, 'SET_IMAGE');

export const setStrokeColorToActiveShape: (hex: string) => void = createEvent(emitter, 'SET_STROKE_COLOR_TO_ACTIVE_SHAPE');

export const setStrokeWidthToActiveShape: (width: number) => void = createEvent(emitter, 'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');

export const setFontSizeToActiveShape: (width: number) => void = createEvent(emitter, 'SET_FONT_SIZE_TO_ACTIVE_SHAPE');

export const exportCanvasToImage : (name: string) => void = createEvent(emitter, 'EXPORT_CANVAS_TO_IMAGE');

export const updateCanvasSize: (data: TWHSize) => void = createEvent(emitter, 'UPDATE_CANVAS_SIZE');

export const blurShapes: () => void = createEvent(emitter, 'BLUR_SHAPES');

export const cropSelected: () => void = createEvent(emitter, 'CROP_SELECTED');

// Create blank canvas, it's an easy way to test shapes,
// without opening an image
export const initBlankCanvas: (props: TWHSize) => void = createEvent(emitter, 'INIT_BLANK_CANVAS');

// Subscribing to events
//

export const imageUpdated: (props: TWHSize) => void = createEvent(emitter, 'IMAGE_UPDATED');

export const shapeClicked: (shape: any) => void = createEvent(emitter, 'SHAPE_CLICKED');

export const shapesBlurred: (shape?: any) => void = createEvent(emitter, 'SHAPES_BLURRED');

export const shapeAdded: (shape: any) => void = createEvent(emitter, 'SHAPE_ADDED');
