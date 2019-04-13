import emitter from './eventsEmitter';
import { connectArrow } from '../connectShape';
import { CREATE_ARROW } from './eventsKeys';

emitter.on(CREATE_ARROW, () => {
    connectArrow();
});
