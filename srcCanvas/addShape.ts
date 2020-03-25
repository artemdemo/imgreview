/* eslint-disable import/prefer-default-export */

import _get from 'lodash/get';
import canvasStore from './store';
import { blurShapes, addShape, setCursor, deleteAllShape } from './model/shapes/shapesActions';
import { ECursorTypes } from './model/shapes/shapesTypes';
import { setImage } from './model/image/imageActions';
import CanvasImage from './Image/CanvasImage';
import Arrow from './Arrow/Arrow';
import Text from './Text/Text';
import { TImageData } from './api';
import { TCanvasState } from './reducers';
import { TCreateTextOptions, TCreateArrowOptions } from './events/eventsTypes';

/**
 * Connect Arrow to the stage.
 * If arrow provided - it will use provided instance,
 * if not - will create new one.
 * @param arrow {Arrow} - I'm using it when coping Arrows.
 * @param options {object}
 */
export const connectArrow = (arrow?: Arrow, options?: TCreateArrowOptions) => {
    const { shapes } = <TCanvasState> canvasStore.getState();
    const _arrow = arrow || new Arrow({
        stroke: _get(options, 'strokeColor', 'green'),
        strokeWidth: _get(options, 'strokeWidth'),
    });
    _arrow.addToLayer(shapes.layer);
    _arrow.on('click', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _arrow.on('dragstart', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _arrow.on('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.MOVE)));
    _arrow.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    _arrow.onAnchor('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.POINTER)));
    _arrow.onAnchor('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    // Setting focus making sense if all shapes are already blurred.
    // Here I'm assuming that this is what happened.
    _arrow.focus();
    canvasStore.dispatch(addShape(_arrow));
};

/**
 * Add Text to stage
 * @param textNode
 * @param options {object}
 */
export const connectText = (textNode?: Text, options?: TCreateTextOptions) => {
    const { shapes, stage } = <TCanvasState> canvasStore.getState();
    const _textNode = textNode || new Text({
        fill: _get(options, 'fillColor', 'green'),
        fontSize: _get(options, 'fontSize'),
    });
    const stageBox = stage.instance?.container().getBoundingClientRect();
    _textNode.addToLayer(
        shapes.layer,
        {
            left: stageBox ? stageBox.left : 0,
            top: stageBox ? stageBox.top : 0,
        },
    );
    _textNode.on('click', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _textNode.on('dragstart', arrowInstance => canvasStore.dispatch(blurShapes(arrowInstance)));
    _textNode.on('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.MOVE)));
    _textNode.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    canvasStore.dispatch(addShape(_textNode));
};

/**
 * Add Image to stage
 * @param data {object}
 */
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
    canvasStore.dispatch(deleteAllShape());
    canvasStore.dispatch(setImage({
        image: canvasImage,
    }));
};
