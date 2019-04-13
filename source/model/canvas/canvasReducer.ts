import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import { cursorTypes } from './canvasConst';

export type TStateCanvas = {
    image: any;
    imageOriginName: string;
    shapes: any;
    cursor: string;
};

const initState: TStateCanvas = {
    image: null,
    imageOriginName: '',
    shapes: [],
    cursor: cursorTypes.auto,
};

export default handleActions({
    // Set Stage
    //
    [canvasActions.setStage]: (state: TStateCanvas, action) => ({
        ...state,
        stage: action.payload,
    }),
    // Add Image
    //
    [canvasActions.addImage]: (state: TStateCanvas, action) => ({
        ...state,
        image: action.payload.image,
        imageOriginName: action.payload.name,
    }),
    // Update Image Size
    //
    [canvasActions.updateImageSize]: (state: TStateCanvas, action) => {
        state.image.setSize(action.payload.width, action.payload.height);
        return state;
    },
    // Set cursor
    //
    [canvasActions.setCursor]: (state: TStateCanvas, action) => ({
        ...state,
        cursor: action.payload,
    }),
}, initState);
