/* eslint-disable import/prefer-default-export */

import store from '../store';
import { TReduxState } from '../reducers';
import { cursorTypes } from '../model/canvas/canvasConst';
import { blurShapes, addArrow } from '../model/shapes/shapesActions';
import { addImage } from '../model/canvas/canvasActions';
import { setCursor } from '../model/canvas/canvasActions';
import CanvasImage from './Image/CanvasImage';
import Arrow from './Arrow/Arrow';
import CanvasEl from './CanvasEl/CanvasEl';
import { TImageData } from './api';

/**
 * Connect Arrow to the stage.
 * If arrow provided - it will use provided instance,
 * if not - will create new one.
 * @param arrow {Arrow}
 */
export const connectArrow = (arrow?: Arrow) => {
    const { shapes } = <TReduxState> store.getState();
    const _arrow = arrow || new Arrow({
        stroke: shapes.strokeColor,
        strokeWidth: shapes.strokeWidth,
    });
    _arrow.addToStage(CanvasEl.stage);
    _arrow.on('click', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('dragstart', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('mouseover', () => store.dispatch(setCursor(cursorTypes.move)));
    _arrow.on('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    _arrow.onAnchor('mouseover', () => store.dispatch(setCursor(cursorTypes.pointer)));
    _arrow.onAnchor('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    store.dispatch(addArrow(_arrow));
};


export const addImageToStage = (data: TImageData) => {
    const { image, name } = data;
    const { canvas } = <TReduxState> store.getState();
    if (canvas.image) {
        canvas.image.destroy();
    }
    CanvasEl.stage.setAttr('width', image.width);
    CanvasEl.stage.setAttr('height', image.height);
    const canvasImage = new CanvasImage({
        image,
    });
    canvasImage.addToStage(CanvasEl.stage);
    store.dispatch(addImage({
        image: canvasImage,
        name,
    }));
};
