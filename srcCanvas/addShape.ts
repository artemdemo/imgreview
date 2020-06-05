/* eslint-disable import/prefer-default-export */

import _get from "lodash/get";
import canvasStore from "./store";
import { blurShapes, addShape, setCursor, deleteAllShapes } from "./model/shapes/shapesActions";
import { ECursorTypes } from "./model/shapes/shapesTypes";
import { setImage } from "./model/image/imageActions";
import CanvasImage from "./Image/CanvasImage";
import Arrow from "./Arrow/Arrow";
import Text from "./Text/Text";
import { TImageData } from "./api";
import { TCanvasState } from "./reducers";
import {TCreateTextOptions, TCreateArrowOptions, TCreateRectOptions} from "./events/eventsTypes";
import Rect from "./Rect/Rect";
import IShape from "./Shape/IShape";
import Shape from "./Shape/Shape";
import SelectRect from "./Select/SelectRect";
import {setStageSize} from "./model/stage/stageActions";

/**
 * Add standard events to the shape.
 * @param shape
 */
const attachGeneralEvents = (shape: IShape) => {
    shape.on('click', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('dragstart', shapeInstance => canvasStore.dispatch(blurShapes(shapeInstance)));
    shape.on('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.MOVE)));
    shape.on('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    canvasStore.dispatch(addShape(shape));
};

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
    _arrow.onAnchor('mouseover', () => canvasStore.dispatch(setCursor(ECursorTypes.POINTER)));
    _arrow.onAnchor('mouseout', () => canvasStore.dispatch(setCursor(ECursorTypes.AUTO)));
    attachGeneralEvents(_arrow);
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
    const stageBox = stage.instance?.container().getBoundingClientRect();
    _textNode.addToLayer(
        shapes.layer,
        {
            left: stageBox ? stageBox.left : 0,
            top: stageBox ? stageBox.top : 0,
        },
    );
    attachGeneralEvents(_textNode);
};

/**
 * Add Rect to stage
 * @param rectNode {Rect}
 * @param options {object}
 */
export const connectRect = (rectNode?: Rect, options?: TCreateRectOptions) => {
    const { shapes } = <TCanvasState> canvasStore.getState();
    const _rectNode = rectNode || new Rect({
        stroke: _get(options, 'strokeColor', 'green'),
        fill: _get(options, 'fill', 'transparent'),
        strokeWidth: _get(options, 'strokeWidth', 2),
    });
    _rectNode.addToLayer(shapes.layer);
    attachGeneralEvents(_rectNode);
};

export const connectSelectRect = () => {
    const { shapes } = <TCanvasState> canvasStore.getState();
    const _selectRectNode = new SelectRect();
    _selectRectNode.addToLayer(shapes.layer);
    attachGeneralEvents(_selectRectNode);
};

/**
 * This is general function that will be used for connecting pasted shapes.
 * Usage will be in CanvasEl.tsx
 * @param shape {Shape}
 * @param options
 */
export const cloneAndConnectShape = (shape: Shape, options?: any) => {
    if (shape instanceof Arrow) {
        // Here I'm copying again (first time was in `shapesReducer`),
        // this way user could paste shape multiple times without collisions
        connectArrow(shape.clone(), options);
    } else if (shape instanceof Text) {
        connectText(shape.clone(), options);
    } else if (shape instanceof Rect) {
        connectRect(shape.clone(), options);
    } else {
        console.error('Given shape doesn\'t have connect() function');
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
