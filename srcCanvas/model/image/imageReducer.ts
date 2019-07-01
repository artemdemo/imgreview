import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as imageActions from './imageActions';
import emitter from '../../events/eventsEmitter';
import * as keys from '../../events/eventsKeys';

export type TStateImage = {
    width: number;
    height: number;
    instance: Konva.Image | null;
};

const initState: TStateImage = {
    width: 0,
    height: 0,
    instance: null,
};

export default handleActions({
    [imageActions.setImage]: (state: TStateImage, action) => {
        const size = action.payload.image.getSize();
        emitter.emit(keys.ON_IMAGE_UPDATE, size);
        return {
            ...state,
            width: size.width,
            height: size.height,
            instance: action.payload.image,
        };
    },
}, initState);
