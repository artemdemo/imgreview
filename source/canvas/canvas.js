import Konva from 'konva';
import CanvasImage from './CanvasImage';
import Arrow from './Arrow/Arrow';
import { drawImageScaled, drawImageAsIs } from './drawImage';

let stage;
let container;

export const init = (containerEl) => {
    container = containerEl;
};

export const setStage = (width, height) => {
    stage = new Konva.Stage({
        container,
        width,
        height,
    });
};

export const drawImage = (image) => {
    setStage(image.width, image.height);

    const imgRef = new CanvasImage(stage);
    imgRef.setImage({
        image,
    });

    // _context.clearRect(0, 0, _canvas.width, _canvas.height);
    // if (img.width > _canvas.width || img.height > _canvas.height) {
    //     drawImageScaled(img, _canvas, _context);
    // } else {
    //     drawImageAsIs(img, _canvas, _context);
    // }
};

export const save = () => {
    // function from https://stackoverflow.com/a/15832662/512042
    function downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const dataURL = stage.toDataURL();
    downloadURI(dataURL, 'stage.png');
};

export const addArrow = () => {
    const arrowRef = new Arrow(stage);
    arrowRef.addArrow();
};
