import { handleActions } from 'redux-actions';
import * as imageActions from './imageActions';
import * as api from '../../api';
import CanvasImage from '../../Image/CanvasImage';
import Konva from 'konva';

export type TStateImage = {
    width: number;
    height: number;
    layer: Konva.Layer;
    instance: CanvasImage | null;
};

const initState: TStateImage = {
    width: 0,
    height: 0,
    layer: new Konva.Layer(),
    instance: null,
};

export default handleActions({
    [imageActions.setImage]: (state: TStateImage, action) => {
        const size = action.payload.image.getSize();
        api.imageUpdated(size);
        return {
            ...state,
            width: size.width,
            height: size.height,
            instance: action.payload.image,
        };
    },
    [imageActions.updateImageSize]: (state: TStateImage, action) => {
        const { width, height } = action.payload;
        api.imageUpdated({ width, height });
        return {
            ...state,
            width,
            height,
        };
    },
    [imageActions.cropImage]: (state: TStateImage, action) => {
        const { x, y, width, height } = action.payload;
        state.instance?.crop(x,y, width, height);
        state.layer.draw();
        return state;
    },
}, initState);
