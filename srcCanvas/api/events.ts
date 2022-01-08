import { createNanoEvents, Unsubscribe } from 'nanoevents';
import { OnCallback, ShapeAddedProps, ShapeDeletedProps } from './api-types';
import Shape from '../canvasShapes/Shape/Shape';
import IShape from '../canvasShapes/Shape/IShape';

const emitter = createNanoEvents();

type PublicEventKeys =
  | 'SHAPE_CLICKED'
  | 'SHAPE_DRAG_STARTED'
  | 'SHAPES_BLURRED'
  | 'SHAPE_ADDED'
  | 'SHAPE_DELETED';

export const apiEventsFactory = <T>(key: PublicEventKeys) => {
  return (cb: OnCallback<T>): Unsubscribe => {
    return emitter.on(key, cb);
  };
};

export const shapeClicked = (shape: Shape) => {
  const key: PublicEventKeys = 'SHAPE_CLICKED';
  emitter.emit(key, shape);
};

export const shapeDragStarted = (shape: Shape) => {
  const key: PublicEventKeys = 'SHAPE_DRAG_STARTED';
  emitter.emit(key, shape);
};

export const shapesBlurred = (shape?: IShape) => {
  const key: PublicEventKeys = 'SHAPES_BLURRED';
  emitter.emit(key, shape);
};

export const shapeAdded = (props: ShapeAddedProps) => {
  const key: PublicEventKeys = 'SHAPE_ADDED';
  emitter.emit(key, props);
};

export const shapeDeleted = (props: ShapeDeletedProps) => {
  const key: PublicEventKeys = 'SHAPE_DELETED';
  emitter.emit(key, props);
};
