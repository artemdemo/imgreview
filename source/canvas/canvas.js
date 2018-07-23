import Konva from 'konva';
import Image from './canvasImage';
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

    const imgRef = new Image(stage);
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
