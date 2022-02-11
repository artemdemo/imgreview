/**
 * This is public API to manipulate with canvas components.
 * Canvas should be isolated from the main application.
 */

import { Unsubscribe } from 'nanoevents';
import { TAddingShape } from '../model/shapes/shapesModelTypes';
import IShape from '../canvasShapes/Shape/IShape';
import { TPos } from '../custom';
export { default as EShapeTypes } from '../canvasShapes/Shape/shapeTypes';

export type StartAddingShapeProps = {
  type: TAddingShape;
  options?: any;
};

export type SetImageProps = {
  image: any;
  name: string;
  pos?: TPos;
};

export type TWHSize = {
  width: number;
  height: number;
};

export type ShapeAddedProps = {
  addedShape: IShape;
};

export type ShapeDeletedProps = {
  deletedShape?: IShape;
};

export enum ChangeOrderActions {
  BringToFront = 'BringToFront',
  SendToBack = 'SendToBack',
}

export type OnCallback<T> = (payload: T) => void;
export type OnApi<T> = (cb: OnCallback<T>) => Unsubscribe;

export type CanvasAPI = {
  startAddingShape: (options: StartAddingShapeProps) => void;
  setImage: (props: SetImageProps) => void;
  setFillColorToActiveShape: (color: string) => void;
  setStrokeColorToActiveShape: (color: string) => void;
  setStrokeWidthToActiveShape: (width: number) => void;
  setFontSizeToActiveShape: (size: number) => void;
  exportCanvasToImage: (name: string) => void;
  copyAllToClipboard: () => void;
  blurShapes: () => void;
  sketchifyActiveShape: () => void;
  getShapesAmount: () => Promise<number>;
  initBlankCanvas: (props: TWHSize) => void;
  changeOrderOfActiveShape: (action: ChangeOrderActions) => void;
  onShapeClicked: OnApi<IShape>;
  onShapeDragStarted: OnApi<IShape>;
  onShapeBlurred: OnApi<IShape>;
  onShapeAdded: OnApi<ShapeAddedProps>;
  onShapeDeleted: OnApi<ShapeDeletedProps>;
};
