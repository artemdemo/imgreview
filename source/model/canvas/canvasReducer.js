import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import { cursorTypes } from './canvasConst';

// edited https://stackoverflow.com/a/37138144
function dataURIToBlob(dataurl) {
    const arr = dataurl.split(',');
    const type = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type });
}

// https://stackoverflow.com/a/37138144
function downloadURI(uri, name) {
    const link = document.createElement('a');
    const blob = dataURIToBlob(uri);
    const objUrl = URL.createObjectURL(blob);

    link.download = name;
    link.href = objUrl;
    link.click();
}

const initState = {
    stage: null,
    image: null,
    imageOriginName: '',
    shapes: [],
    cursor: cursorTypes.auto,
};

export default handleActions({
    // Set Stage
    //
    [canvasActions.setStage]: (state, action) => ({
        ...state,
        stage: action.payload,
    }),
    // Save Canvas
    //
    [canvasActions.saveCanvas]: (state, action) => {
        const dataURL = state.stage.toDataURL();
        downloadURI(dataURL, action.payload);
        return state;
    },
    // Add Image
    //
    [canvasActions.addImage]: (state, action) => ({
        ...state,
        image: action.payload.image,
        imageOriginName: action.payload.name,
    }),
    // Update Image Size
    //
    [canvasActions.updateImageSize]: (state, action) => {
        state.image.setSize(action.payload.width, action.payload.height);
        state.stage.setAttr('width', action.payload.width);
        state.stage.setAttr('height', action.payload.height);
        return state;
    },
    // Set cursor
    //
    [canvasActions.setCursor]: (state, action) => ({
        ...state,
        cursor: action.payload,
    }),
}, initState);
