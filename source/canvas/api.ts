/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the interface components.
 */

import emitter from './events/eventsEmitter';
import * as keys from './events/eventsKeys';

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

export const createArrow = () => {
    emitter.emit(keys.CREATE_ARROW);
};

export const setImage = (data: TImageData) => {
    emitter.emit(keys.SET_IMAGE, data);
};

export const exportCanvasToImage = (name: string) => {
    emitter.emit(keys.EXPORT_CANVAS_TO_IMAGE, name);
};

export const updateCanvasSize = (data: TCanvasSize) => {
    emitter.emit(keys.UPDATE_CANVAS_SIZE, data);
};

// Subscribing to events
//

export const onImageUpdate = (cb: () => void) => {
    emitter.on(keys.ON_IMAGE_UPDATE, cb);
};
