import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as imageActions from './imageActions';
import emitter from '../../events/eventsEmitter';
import * as keys from '../../events/eventsKeys';

export type TStateImage = {
    instance: Konva.Image | null;
};

const initState: TStateImage = {
    instance: null,
};

export default handleActions({
    [imageActions.setImage]: (state: TStateImage, action) => {
        emitter.emit(keys.ON_IMAGE_UPDATE, action.payload.image.getSize());
        return {
            ...state,
            instance: action.payload.image,
        };
    },
}, initState);
