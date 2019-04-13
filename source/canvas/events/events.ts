import emitter from './eventsEmitter';
import { connectArrow, addImageToStage } from '../addShape';
import * as keys from './eventsKeys';
import { TImageData } from '../api';

emitter.on(keys.CREATE_ARROW, () => {
    connectArrow();
});

emitter.on(keys.SET_IMAGE, (data: TImageData) => {
    addImageToStage(data);
});
