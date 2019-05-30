/* eslint-disable import/prefer-default-export */

import _get from 'lodash/get';
import canvasStore from './store';
import { blurShapes, addArrow, setCursor } from './model/shapes/shapesActions';
import { ECursorTypes } from './model/shapes/shapesTypes';
import { setImage } from './model/image/imageActions';
import CanvasImage from './Image/CanvasImage';
import Arrow from './Arrow/Arrow';
import { TImageData } from './api';

/**
 * Connect Arrow to the stage.
 * If arrow provided - it will use provided instance,
 * if not - will create new one.
 * @param arrow {Arrow|null} - I'm using it when coping Arrows.
 * @param options {object}
 * @param options.strokeColor {string}
 * @param options.strokeWidth {number}
 */
export const connectArrow = (arrow?: Arrow|null, options?: { strokeColor: string, strokeWidth: number }) => {
    const { stage } = <any> canvasStore.getState();
    const _arrow = arrow || new Arrow({
        stroke: _get(options, 'strokeColor'),
        strokeWidth: _get(options, 'strokeWidth'),
    });
    _arrow.addToStage(stage.instance);
    _arrow.on('click', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _arrow.on('dragstart', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _arrow.on('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.MOVE)));
    _arrow.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    _arrow.onAnchor('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.POINTER)));
    _arrow.onAnchor('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    canvasStore.dispatch(addArrow(_arrow));
};


export const addImageToStage = (data: TImageData) => {
    const { stage, image } = <any> canvasStore.getState();
    if (image.instance) {
        image.instance.destroy();
    }
    stage.instance.setAttr('width', data.image.width);
    stage.instance.setAttr('height', data.image.height);
    const canvasImage = new CanvasImage({
        image: data.image,
    });
    canvasImage.addToStage(stage.instance);
    canvasStore.dispatch(setImage({
        image: canvasImage,
    }));
};