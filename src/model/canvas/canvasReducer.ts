import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import { cursorTypes } from './canvasConst';

export type TStateCanvas = {
    width: number;
    height: number;
    imageOriginName: string;
    cursor: string;
};

const initState: TStateCanvas = {
    width: 0,
    height: 0,
    imageOriginName: '',
    cursor: cursorTypes.auto,
};

export default handleActions({
    // Add Image
    //
    [canvasActions.addImage]: (state: TStateCanvas, action) => ({
        ...state,
        imageOriginName: action.payload.name,
    }),
    // Set cursor
    //
    [canvasActions.setCursor]: (state: TStateCanvas, action) => ({
        ...state,
        cursor: action.payload,
    }),
    [canvasActions.updateCanvasSize]: (state: TStateCanvas, action) => ({
        ...state,
        width: action.payload.width,
        height: action.payload.height,
    }),
}, initState);
