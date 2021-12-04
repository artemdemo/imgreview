import Konva, { TPos } from 'konva';
import shapeTypes from './shapeTypes';

export type TScaleProps = {
  wFactor: number;
  hFactor: number;
  stagePosition: {
    left: number;
    top: number;
  };
};

interface IShape {
  type: shapeTypes;

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer): void;

  setStrokeColor?(hex: string): void;
  getStrokeColor?(): string;

  setFillColor?(hex: string): void;
  getFillColor?(): string;

  on(key: string, cb): void;

  blur(): void;
  focus(): void;

  /**
   * This method will be triggered after cropping the canvas.
   * @param cropFramePosition
   */
  crop(cropFramePosition: TPos): void;

  /**
   * This method will be triggered to change shape size after scaling the canvas.
   * @param scaleProps
   */
  scale(scaleProps: TScaleProps): void;

  /**
   * This method will be used only for initial "click and draw" of the shape.
   * @param startPos
   * @param currentPos
   */
  initDraw(startPos: TPos, currentPos: TPos): void;

  draggable(value: boolean): boolean;

  clone(): IShape;

  destroy(): void;

  isSelected(): boolean;

  isConnected(): boolean;
}

export default IShape;
