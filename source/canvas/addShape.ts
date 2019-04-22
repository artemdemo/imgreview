/* eslint-disable import/prefer-default-export */

import _get from 'lodash/get';
import store from '../store';
import canvasStore from './store';
import { cursorTypes } from '../model/canvas/canvasConst';
import { blurShapes, addArrow } from '../model/shapes/shapesActions';
import { setImage } from './model/image/imageActions';
import { setCursor } from '../model/canvas/canvasActions';
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
        stroke: _get(options, 'strokeColor', '#000'),
        strokeWidth: _get(options, 'strokeWidth', 5),
    });
    _arrow.addToStage(stage.instance);
    _arrow.on('click', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('dragstart', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('mouseover', () => store.dispatch(setCursor(cursorTypes.move)));
    _arrow.on('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    _arrow.onAnchor('mouseover', () => store.dispatch(setCursor(cursorTypes.pointer)));
    _arrow.onAnchor('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    store.dispatch(addArrow(_arrow));
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
