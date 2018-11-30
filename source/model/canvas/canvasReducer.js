import { createReducer } from 'redux-act';
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

export default createReducer({
    // Set Stage
    //
    [canvasActions.setStage]: (state, payload) => ({
        ...state,
        stage: payload,
    }),
    // Save Canvas
    //
    [canvasActions.saveCanvas]: (state, payload) => {
        const dataURL = state.stage.toDataURL();
        downloadURI(dataURL, payload);
        return state;
    },
    // Add Image
    //
    [canvasActions.addImage]: (state, payload) => ({
        ...state,
        image: payload.image,
        imageOriginName: payload.name,
    }),
    // Update Image Size
    //
    [canvasActions.updateImageSize]: (state, payload) => {
        state.image.setSize(payload.width, payload.height);
        state.stage.setAttr('width', payload.width);
        state.stage.setAttr('height', payload.height);
        return state;
    },
    // Set cursor
    //
    [canvasActions.setCursor]: (state, payload) => ({
        ...state,
        cursor: payload,
    }),
}, initState);
