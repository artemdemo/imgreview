/* eslint-disable import/prefer-default-export */

import _get from 'lodash/get';
import canvasStore from './store';
import { blurShapes, addShape, setCursor, deleteAllShapes } from './model/shapes/shapesActions';
import { ECursorTypes } from './model/shapes/shapesTypes';
import { setImage } from './model/image/imageActions';
import CanvasImage from './Image/CanvasImage';
import Arrow from './Arrow/Arrow';
import Text from './Text/Text';
import { TImageData } from './api';
import { TCanvasState } from './reducers';
import {TCreateTextOptions, TCreateArrowOptions, TCreateRectOptions, TCreateEllipseOptions} from './events/eventsTypes';
import Rect from './Rect/Rect';
import Shape from './Shape/Shape';
import SelectRect from './Select/SelectRect';
import {setStageSize} from './model/stage/stageActions';
import EShapeTypes from './Shape/shapeTypes';
import Ellipse from './Ellipse/Ellipse';

/**
 * Add standard events to the shape.
 * @param shape
 */
const attachGeneralEvents = (shape: Shape) => {
    shape.on('click', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('dragstart', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.MOVE)));
    shape.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
};

export const _createArrow = (arrow?: Arrow, options?: TCreateArrowOptions): Arrow => {
    const _arrow = arrow || new Arrow({
        stroke: _get(options, 'strokeColor', 'green'),
        strokeWidth: _get(options, 'strokeWidth'),
    });
    _arrow.onAnchor('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.POINTER)));
    _arrow.onAnchor('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    attachGeneralEvents(_arrow);
    return _arrow;
};

export const _connectArrow = (arrow: Arrow) => {
    canvasStore.dispatch(addShape(arrow));
};

/**
 * Create and connect Arrow to the stage.
 * If arrow provided - it will use provided instance,
 * if not - will create new one.
 * @param arrow {Arrow} - I'm using it when coping Arrows.
 * @param options {object}
 */
export const createAndConnectArrow = (arrow?: Arrow, options?: TCreateArrowOptions) => {
    const _arrow = _createArrow(arrow, options);
    _connectArrow(_arrow);
};

/**
 * Add Text to stage
 * @param textNode {Text}
 * @param options {object}
 */
export const connectText = (textNode?: Text, options?: TCreateTextOptions) => {
    const { shapes, stage } = <TCanvasState> canvasStore.getState();
    const _textNode = textNode || new Text({
        fill: _get(options, 'fillColor', 'green'),
        fontSize: _get(options, 'fontSize'),
    });
    _textNode.onDblClickGetStagePosition(() => {
        const stageBox = stage.instance?.container().getBoundingClientRect();
        return {
            left: stageBox ? stageBox.left : 0,
            top: stageBox ? stageBox.top : 0,
        };
    });
    attachGeneralEvents(_textNode);
    canvasStore.dispatch(addShape(_textNode));
};

export const _createRect = (rectNode?: Rect, options?: TCreateRectOptions): Rect => {
    const _rectNode = rectNode || new Rect({
        stroke: _get(options, 'strokeColor', 'green'),
        fill: _get(options, 'fill', 'transparent'),
        strokeWidth: _get(options, 'strokeWidth', 2),
    });
    attachGeneralEvents(_rectNode);
    return _rectNode;
};

export const _createEllipse = (circleNode?: Ellipse, options?: TCreateEllipseOptions): Ellipse => {
    const _circleNode = circleNode || new Ellipse({
        stroke: _get(options, 'strokeColor', 'green'),
        fill: _get(options, 'fill', 'transparent'),
        strokeWidth: _get(options, 'strokeWidth', 2),
    });
    attachGeneralEvents(_circleNode);
    return _circleNode;
};

export const _connectRect = (rectNode: Rect) => {
    canvasStore.dispatch(addShape(rectNode));
};

export const _connectEllipse = (circleNode: Ellipse) => {
    canvasStore.dispatch(addShape(circleNode));
};


export const createAndConnectRect = (rectNode?: Rect, options?: TCreateRectOptions) => {
    const rect = _createRect(rectNode, options);
    _connectRect(rect);
};

export const createAndConnectEllipse = (circleNode?: Ellipse, options?: TCreateEllipseOptions) => {
    const circle = _createEllipse(circleNode, options);
    _connectEllipse(circle);
};

export const _createSelectRect = (): SelectRect => {
    const _selectRect = new SelectRect();
    attachGeneralEvents(_selectRect);
    return _selectRect;
};

export const _connectSelectRect = (selectRect: SelectRect) => {
    canvasStore.dispatch(addShape(selectRect));
};

export const createAndConnectSelectRect = () => {
    const selectRectNode = _createSelectRect();
    _connectSelectRect(selectRectNode);
};

export const connectShape = (shape: Shape) => {
    switch (shape.type) {
        case EShapeTypes.ARROW:
            _connectArrow(<Arrow>shape);
            break;
        case EShapeTypes.RECT:
            _connectRect(<Rect>shape);
            break;
        case EShapeTypes.SELECT_RECT:
            _connectSelectRect(<SelectRect>shape);
            break;
        case EShapeTypes.ELLIPSE:
            _connectEllipse(<Ellipse>shape);
            break;
        default:
            console.error('Can\'t connect given shape');
            console.log(shape);
    }
};

/**
 * This is general function that will be used for connecting pasted shapes.
 * Usage will be in CanvasEl.tsx
 * @param shape {Shape}
 * @param options
 */
export const cloneAndConnectShape = (shape: Shape, options?: any) => {
    switch (shape.type) {
        case EShapeTypes.ARROW:
            // Here I'm copying again (first time was in `shapesReducer`),
            // this way user could paste shape multiple times without collisions
            createAndConnectArrow((<Arrow>shape).clone(), options);
            break;
        case EShapeTypes.TEXT:
            connectText((<Text>shape).clone(), options);
            break;
        case EShapeTypes.RECT:
            createAndConnectRect((<Rect>shape).clone(), options);
            break;
        case EShapeTypes.ELLIPSE:
            createAndConnectEllipse((<Ellipse>shape).clone(), options);
            break;
        default:
            console.error('Can\'t clone and connect given shape');
            console.log(shape);
    }
};

/**
 * Add Image to stage
 * @param data {object}
 */
export const addImageToStage = (data: TImageData) => {
    const { stage, image } = <TCanvasState>canvasStore.getState();
    if (image.instance) {
        image.instance.destroy();
    }
    canvasStore.dispatch(setStageSize({
        width: data.image.width,
        height: data.image.height,
    }));
    const canvasImage = new CanvasImage({
        image: data.image,
    });
    canvasImage.addToStage(stage.instance);
    canvasStore.dispatch(deleteAllShapes());
    canvasStore.dispatch(setImage({
        image: canvasImage,
    }));
};
