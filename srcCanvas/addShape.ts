/* eslint-disable import/prefer-default-export */

import _get from 'lodash/get';
import canvasStore from './store';
import { blurShapes, addShape, setCursor, deleteAllShapes } from './model/shapes/shapesActions';
import { ECursorTypes } from './model/shapes/shapesModelTypes';
import { setImage } from './model/image/imageActions';
import CanvasImage from './Image/CanvasImage';
import Arrow from './Arrow/Arrow';
import Text from './Text/Text';
import { TImageData, shapeAdded } from './api';
import { TCanvasState } from './reducers';
import {TCreateTextOptions, TCreateArrowOptions, TCreateRectOptions, TCreateEllipseOptions} from './events/eventsTypes';
import Rect from './Rect/Rect';
import Shape from './Shape/Shape';
import SelectRect from './Rect/SelectRect';
import {setStageSize} from './model/stage/stageActions';
import EShapeTypes from './Shape/shapeTypes';
import Ellipse from './Ellipse/Ellipse';
import RectRough from './Rect/RectRough';

/**
 * Add standard events to the shape.
 * @param shape
 */
const attachGeneralEvents = (shape: Shape) => {
    shape.on('click', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('dragstart', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('mouseover', () => {
        const { shapes } = <TCanvasState>canvasStore.getState();
        // While adding shape user shouldn't be able to interact with existing shapes.
        shape.draggable(!shapes.addingShapeRef);
        const cursor = shapes.addingShapeRef ? ECursorTypes.AUTO : ECursorTypes.MOVE;
        canvasStore.dispatch(setCursor(cursor));
    });
    shape.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    const unsubShapeAdded = shapeAdded.on(() => {
        shape.draggable(true);
    });
    shape.on('_beforedestroy', () => {
        unsubShapeAdded();
    });
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
    const { stage } = <TCanvasState> canvasStore.getState();
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

type TRectLike = Rect|RectRough|SelectRect|Ellipse;
type TCreateRectLikeOptions = TCreateRectOptions|TCreateEllipseOptions;

export const _createRectLike = (rectNode?: TRectLike, options?: TCreateRectLikeOptions, type?: EShapeTypes): TRectLike => {
    const props = {
        stroke: _get(options, 'strokeColor', 'green'),
        fill: _get(options, 'fill', 'transparent'),
        strokeWidth: _get(options, 'strokeWidth', 2),
    };
    const _rectNode = (() => {
        if (rectNode) {
            return rectNode;
        }
        switch (type) {
            case EShapeTypes.RECT:
                return new Rect(props);
            case EShapeTypes.RECT_ROUGH:
                return new RectRough(props);
            case EShapeTypes.ELLIPSE:
                return new Ellipse(props);
            case EShapeTypes.SELECT_RECT:
                return new SelectRect();
        }
    })();
    if (!_rectNode) {
        throw new Error('rectNode is not defined');
    }
    attachGeneralEvents(_rectNode);
    return _rectNode;
};

export const _connectRectLike = (rectLikeNode: TRectLike) => {
    canvasStore.dispatch(addShape(rectLikeNode));
};

export const createAndConnectRectLike = (rectLikeNode?: TRectLike, options?: TCreateRectOptions, type?: EShapeTypes) => {
    const rect = _createRectLike(rectLikeNode, options, type);
    _connectRectLike(rect);
};

export const createAndConnectSelectRect = () => {
    const selectRectNode = _createRectLike();
    _createRectLike(selectRectNode);
};

export const connectShape = (shape: Shape) => {
    switch (shape.type) {
        case EShapeTypes.ARROW:
            _connectArrow(<Arrow>shape);
            break;
        case EShapeTypes.RECT:
        case EShapeTypes.RECT_ROUGH:
        case EShapeTypes.ELLIPSE:
        case EShapeTypes.SELECT_RECT:
            _connectRectLike(<Rect|Ellipse>shape);
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
        case EShapeTypes.RECT_ROUGH:
        case EShapeTypes.ELLIPSE:
            createAndConnectRectLike((<Rect|Ellipse>shape).clone(), options);
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
