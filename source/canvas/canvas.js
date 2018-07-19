import Konva from 'konva';
import { drawImageScaled, drawImageAsIs } from './drawImage';

let stage;

export const setStage = (container, width, height) => {
    stage = new Konva.Stage({
        container,
        width,
        height,
    });
};

export const drawImage = (image) => {
    const imgLayer = new Konva.Layer();
    const imgIns = new Konva.Image({
        image,
    });
    imgLayer.add(imgIns);
    stage.add(imgLayer);
    console.log(stage);

    // _context.clearRect(0, 0, _canvas.width, _canvas.height);
    // if (img.width > _canvas.width || img.height > _canvas.height) {
    //     drawImageScaled(img, _canvas, _context);
    // } else {
    //     drawImageAsIs(img, _canvas, _context);
    // }
};
