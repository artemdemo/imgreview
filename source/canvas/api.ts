/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the interface components.
 */

import emitter from './events/eventsEmitter';
import * as keys from './events/eventsKeys';

export const createArrow = () => {
    emitter.emit(keys.CREATE_ARROW);
};

export type TImageData = {
    image: any;
    name: string;
};
export const setImage = (data: TImageData) => {
    emitter.emit(keys.SET_IMAGE, data);
};
