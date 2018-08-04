import Konva from 'konva/konva';
import * as canvasActions from './canvasActions';
import CanvasImage from '../../canvas/CanvasImage';
import Arrow from '../../canvas/Arrow/Arrow';

const initState = {
    container: null,
    stage: null,
};

// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function canvasReducer(state = initState, action) {
    switch (action.type) {
        // Set Container
        //
        case `${canvasActions.setContainer}`:
            return {
                ...state,
                container: action.containerEl,
            };
        // Add Image
        //
        case `${canvasActions.addImage}`:
            if (!state.stage) {
                const stage = new Konva.Stage({
                    container: state.container,
                    width: action.image.width,
                    height: action.image.height,
                });
                const imgRef = new CanvasImage(stage);
                imgRef.setImage({
                    image: action.image,
                });
                return {
                    ...state,
                    stage,
                };
            }
            console.warn('Adding second image is not supported');
            return state;
        // Save Canvas
        //
        case `${canvasActions.saveCanvas}`:
            const dataURL = state.stage.toDataURL();
            downloadURI(dataURL, 'stage.png');
            return state;
        // Add Arrow
        //
        case `${canvasActions.addArrow}`:
            const arrowRef = new Arrow(state.stage);
            arrowRef.addArrow();
            return state;
        default:
            return state;
    }
};
