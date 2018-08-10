import * as canvasActions from './canvasActions';
import Arrow from '../../canvas/Arrow/Arrow';

const initState = {
    stage: null,
    hasImage: false,
};

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

export default function canvasReducer(state = initState, action) {
    switch (action.type) {
        // Set Stage
        //
        case `${canvasActions.setStage}`:
            return {
                ...state,
                stage: action.stage,
            };
        case `${canvasActions.imageAdded}`:
            return {
                ...state,
                hasImage: true,
            };
        // Save Canvas
        //
        case `${canvasActions.saveCanvas}`:
            const dataURL = state.stage.toDataURL();
            downloadURI(dataURL, 'stage.png');
            return state;
        // Add Arrow
        //
        case `${canvasActions.addArrow}`:
            const arrowRef = new Arrow();
            arrowRef.addToStage(state.stage);
            return state;
        default:
            return state;
    }
};
