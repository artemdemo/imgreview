/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the interface components.
 */

import emitter from './events/eventsEmitter';
import { CREATE_ARROW } from './events/eventsKeys';

export const createArrow = () => {
    emitter.emit(CREATE_ARROW);
};
