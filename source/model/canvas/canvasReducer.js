import * as canvasActions from './canvasActions';
import Arrow from '../../canvas/Arrow/Arrow';
import CanvasImage from '../../canvas/CanvasImage';

const initState = {
    stage: null,
    image: null,
    shapes: [],
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
        // Stage Clicked
        //
        case `${canvasActions.stageClicked}`:
            state.shapes.forEach((shape) => {
                if (shape.clearFocus) {
                    shape.clearFocus();
                }
            });
            return state;
        // Save Canvas
        //
        case `${canvasActions.saveCanvas}`:
            state.shapes.forEach((shape) => {
                if (shape.clearFocus) {
                    shape.clearFocus();
                }
            });
            const dataURL = state.stage.toDataURL();
            downloadURI(dataURL, 'stage.png');
            return state;
        // Add Arrow
        //
        case `${canvasActions.addArrow}`:
            const arrow = new Arrow();
            arrow.addToStage(state.stage);
            return {
                ...state,
                shapes: [
                    ...state.shapes,
                    arrow,
                ],
            };
        // Add Image
        //
        case `${canvasActions.addImage}`:
            if (state.image) {
                state.image.destroy();
            }
            state.stage.setAttr('width', action.image.width);
            state.stage.setAttr('height', action.image.height);
            const image = new CanvasImage({
                image: action.image,
            });
            image.addToStage(state.stage);
            return {
                ...state,
                image,
            };
        default:
            return state;
    }
};
