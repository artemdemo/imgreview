/* eslint-disable import/prefer-default-export */

import _ from 'lodash';
import canvasStore from './store';
import {addShape, blurShapes, setCursor} from './model/shapes/shapesActions';
import {ECursorTypes} from './model/shapes/shapesModelTypes';
import CanvasImage from './canvasShapes/Image/CanvasImage';
import Arrow from './canvasShapes/Arrow/Arrow';
import Text from './canvasShapes/Text/Text';
import * as canvasApi from './api';
import {TCanvasState} from './reducers';
import {
  TCreateArrowOptions,
  TCreateEllipseOptions,
  TCreateRectOptions,
  TCreateTextOptions,
} from './events/eventsTypes';
import Rect from './canvasShapes/RectLike/Rect';
import Shape from './canvasShapes/Shape/Shape';
import SelectRect from './canvasShapes/RectLike/SelectRect';
import EShapeTypes from './canvasShapes/Shape/shapeTypes';
import Ellipse from './canvasShapes/RectLike/Ellipse';
import RectRough from './canvasShapes/RectLike/RectRough';
import EllipseRough from './canvasShapes/RectLike/EllipseRough';

/**
 * Add standard events to the shape.
 * @param shape
 */
const attachGeneralEvents = (shape: Shape) => {
  shape.on('click', (shapeInstance) => {
    canvasStore.dispatch(blurShapes(shapeInstance));
  });
  shape.on('dragstart', (shapeInstance) => {
    canvasStore.dispatch(blurShapes(shapeInstance));
  });
  shape.on('mouseover', () => {
    const { shapes, stage } = <TCanvasState>canvasStore.getState();
    if (stage.isDraggable) {
      shape.draggable(false);
    } else {
      // While adding shape user shouldn't be able to interact with existing shapes.
      shape.draggable(!shapes.addingShapeRef);
    }
    const cursor = shapes.addingShapeRef
      ? ECursorTypes.AUTO
      : ECursorTypes.MOVE;
    // Cursor should be changed only if stage is not dragged.
    // In this case, cursor is already set.
    if (!stage.isDraggable) {
      canvasStore.dispatch(setCursor(cursor));
    }
  });
  shape.on('mouseout', () => {
    const { stage } = <TCanvasState>canvasStore.getState();
    // Cursor should be changed only if stage is not dragged.
    // In this case, cursor is already set.
    if (!stage.isDraggable) {
      canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
    }
  });
  const unsubShapeAdded = canvasApi.shapeAdded.on(() => {
    shape.draggable(true);
  });
  shape.on('_beforedestroy', () => {
    unsubShapeAdded();
  });
};

export const _createArrow = (
  arrow?: Arrow,
  options?: TCreateArrowOptions,
): Arrow => {
  const _arrow =
    arrow ||
    new Arrow({
      stroke: _.get(options, 'strokeColor', 'green'),
      strokeWidth: _.get(options, 'strokeWidth'),
    });
  _arrow.onAnchor('mouseover', () =>
    canvasStore.dispatch(setCursor(ECursorTypes.POINTER)),
  );
  _arrow.onAnchor('mouseout', () =>
    canvasStore.dispatch(setCursor(ECursorTypes.AUTO)),
  );
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
export const createAndConnectArrow = (
  arrow?: Arrow,
  options?: TCreateArrowOptions,
) => {
  const _arrow = _createArrow(arrow, options);
  _connectArrow(_arrow);
};

export const _createText = (
  textNode?: Text,
  options?: TCreateTextOptions,
): Text => {
  const _textNode =
    textNode ||
    new Text({
      fill: _.get(options, 'fillColor', 'green'),
      fontSize: _.get(options, 'fontSize'),
    });
  _textNode.onDblClickGetStagePosition(() => {
    const { stage } = <TCanvasState>canvasStore.getState();
    const stageBox = stage.instance?.getBoundingClientRect();
    return {
      left: stageBox ? stageBox.left : 0,
      top: stageBox ? stageBox.top : 0,
    };
  });
  attachGeneralEvents(_textNode);
  return _textNode;
};

export const _connectText = (textNode: Text) => {
  canvasStore.dispatch(addShape(textNode));
};

export const createAndConnectText = (
  textNode?: Text,
  options?: TCreateTextOptions,
) => {
  const _textNode = _createText(textNode, options);
  _connectText(_textNode);
};

type TRectLike = Rect | RectRough | SelectRect | Ellipse;
type TCreateRectLikeOptions = TCreateRectOptions | TCreateEllipseOptions;

export const _createRectLike = (
  rectNode?: TRectLike,
  options?: TCreateRectLikeOptions,
  type?: EShapeTypes,
): TRectLike => {
  const props = {
    stroke: _.get(options, 'strokeColor', 'green'),
    fill: _.get(options, 'fill', 'transparent'),
    strokeWidth: _.get(options, 'strokeWidth', 2),
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
      case EShapeTypes.ELLIPSE_ROUGH:
        return new EllipseRough(props);
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

export const createAndConnectRectLike = (
  rectLikeNode?: TRectLike,
  options?: TCreateRectOptions,
  type?: EShapeTypes,
) => {
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
    case EShapeTypes.TEXT:
      _connectText(<Text>shape);
      break;
    case EShapeTypes.RECT:
    case EShapeTypes.RECT_ROUGH:
    case EShapeTypes.ELLIPSE:
    case EShapeTypes.ELLIPSE_ROUGH:
    case EShapeTypes.SELECT_RECT:
      _connectRectLike(<Rect | Ellipse>shape);
      break;
    default:
      console.error("Can't connect given shape");
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
      createAndConnectText((<Text>shape).clone(), options);
      break;
    case EShapeTypes.RECT:
    case EShapeTypes.RECT_ROUGH:
    case EShapeTypes.ELLIPSE:
    case EShapeTypes.ELLIPSE_ROUGH:
      createAndConnectRectLike((<Rect | Ellipse>shape).clone(), options);
      break;
    case EShapeTypes.IMAGE:
      connectImage((<CanvasImage>shape).clone());
      break;
    default:
      console.error("Can't clone and connect given shape");
      console.log(shape);
  }
};

const connectImage = (canvasImage: CanvasImage) => {
  attachGeneralEvents(canvasImage);
  canvasStore.dispatch(addShape(canvasImage));
};

/**
 * Add Image to stage
 * @param data {object}
 */
export const addImageToStage = (data: canvasApi.SetImageData) => {
  const { stage } = canvasStore.getState() as TCanvasState;
  if (!stage.instance) {
    throw new Error('Stage is not defined');
  }
  const absPos = stage.instance.absolutePosition()!;
  const canvasImage = new CanvasImage(
    data.image,
    data.pos
      ? {
          x: data.pos.x - absPos.x,
          y: data.pos.y - absPos.y,
        }
      : {
          x: stage.instance.width() / 2 - data.image.width / 2 - absPos.x,
          y: stage.instance.height() / 2 - data.image.height / 2 - absPos.y,
        },
  );
  connectImage(canvasImage);
};
