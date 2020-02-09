import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';

export type TStateCanvas = {
    width: number;
    height: number;
    imageOriginName: string;
};

const initState: TStateCanvas = {
    width: 0,
    height: 0,
    imageOriginName: '',
};

export default handleActions({
    // Add Image
    //
    [canvasActions.addImage]: (state: TStateCanvas, action) => ({
        ...state,
        imageOriginName: action.payload.name,
    }),
    [canvasActions.updateCanvasSize]: (state: TStateCanvas, action) => ({
        ...state,
        width: action.payload.width,
        height: action.payload.height,
    }),
}, initState);
