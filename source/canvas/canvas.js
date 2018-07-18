import { drawImageScaled, drawImageAsIs } from './drawImage';

let _context;
let _canvas;

export const setContext = (canvas) => {
    _canvas = canvas;
    _context = canvas.getContext('2d');
};

export const drawImage = (img) => {
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
    if (img.width > _canvas.width || img.height > _canvas.height) {
        drawImageScaled(img, _canvas, _context);
    } else {
        drawImageAsIs(img, _canvas, _context);
    }
};
