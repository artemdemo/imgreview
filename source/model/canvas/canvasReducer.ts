import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import { cursorTypes } from './canvasConst';

export type TStateCanvas = {
    imageOriginName: string;
    shapes: any;
    cursor: string;
};

const initState: TStateCanvas = {
    imageOriginName: '',
    shapes: [],
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
}, initState);
