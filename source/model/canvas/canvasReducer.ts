import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import { cursorTypes } from './canvasConst';

export type TStateCanvas = {
    imageWidth: number;
    imageHeight: number;
    imageOriginName: string;
    cursor: string;
};

const initState: TStateCanvas = {
    imageWidth: 0,
    imageHeight: 0,
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
    [canvasActions.updateImageSize]: (state: TStateCanvas, action) => ({
        ...state,
        imageWidth: action.payload.width,
        imageHeight: action.payload.height,
    }),
}, initState);
