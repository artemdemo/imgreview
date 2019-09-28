/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import NanoEvents from 'nanoevents';
import { createEvent } from './events/eventCreator';
import { TCreateArrowOptions } from './events/eventsTypes';
import Shape from './Shape/Shape';

const emitter = new NanoEvents();

export type TImageData = {
    image: any;
    name: string;
};

export type TCanvasSize = {
    width: number;
    height: number;
};

// Emitting events
//

export const createArrow: (options?: TCreateArrowOptions) => void = createEvent(emitter, 'CREATE_ARROW');

export const setImage: (data: TImageData) => void = createEvent(emitter, 'SET_IMAGE');

export const setStrokeColorToActiveShape: (hex: string) => void = createEvent(emitter, 'SET_STROKE_COLOR_TO_ACTIVE_SHAPE');

export const setStrokeWidthToActiveShape: (width: number) => void = createEvent(emitter, 'SET_STROKE_WIDTH_TO_ACTIVE_SHAPE');

export const exportCanvasToImage : (name: string) => void = createEvent(emitter, 'EXPORT_CANVAS_TO_IMAGE');

export const updateCanvasSize: (data: TCanvasSize) => void = createEvent(emitter, 'UPDATE_CANVAS_SIZE');

export const blurShapes: () => void = createEvent(emitter, 'BLUR_SHAPES');

// Create blank canvas, it's an easy way to test shapes,
// without opening an image
export const initBlankCanvas: (props: { width: number, height: number }) => void = createEvent(emitter, 'INIT_BLANK_CANVAS');

// Subscribing to events
//

export const imageUpdated: (size: number) => void = createEvent(emitter, 'IMAGE_UPDATED');

export const shapeClicked: (shape: Shape) => void = createEvent(emitter, 'SHAPE_CLICKED');
