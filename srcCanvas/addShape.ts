/* eslint-disable import/prefer-default-export */

import _get from "lodash/get";
import canvasStore from "./store";
import { blurShapes, addShape, setCursor, deleteAllShape } from "./model/shapes/shapesActions";
import { ECursorTypes } from "./model/shapes/shapesTypes";
import { setImage } from "./model/image/imageActions";
import CanvasImage from "./Image/CanvasImage";
import Arrow from "./Arrow/Arrow";
import Text from "./Text/Text";
import { TImageData } from "./api";
import { TCanvasState } from "./reducers";
import { TCreateTextOptions, TCreateArrowOptions } from "./events/eventsTypes";
import Rect from "./Rect/Rect";
import IShape from "./Shape/IShape";

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
    // Setting focus making sense if all shapes are already blurred.
    // Here I'm assuming that this is what happened.
    _arrow.focus();
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
 * @param rectNode
 * @param options
 */
export const connectRect = (rectNode?: Rect, options?: any) => {
    const { shapes } = <TCanvasState> canvasStore.getState();
    const _rectNode = rectNode || new Rect({
        stroke: _get(options, 'stroke', 'green'),
        fill: _get(options, 'fill', 'transparent'),
        strokeWidth: _get(options, 'strokeWidth', 2),
    });
    _rectNode.addToLayer(shapes.layer);
    attachGeneralEvents(_rectNode);
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
