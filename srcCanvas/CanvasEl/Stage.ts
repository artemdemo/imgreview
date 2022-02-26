import Konva from 'konva';
import canvasStore from '../store';
import {
  ANCHORS_LAYER_CLS,
  SHAPES_LAYER_CLS,
} from '../model/shapes/shapesConst';
import { CallbackMap } from '../services/CallbackMap';
import { blurShapes } from '../model/shapes/shapesActions';
import { BoundariesRect, OnEvtKey, TPos } from '../custom';
import { calcShapesBoundariesRect } from '../services/shapes';

class Stage {
  private readonly stage: Konva.Stage;
  private readonly cbMap: CallbackMap<OnEvtKey> = new CallbackMap<OnEvtKey>();

  constructor(el: HTMLDivElement) {
    this.stage = new Konva.Stage({
      container: el,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const { shapes } = canvasStore.getState();
    this.add(shapes.shapesLayer);
    this.add(shapes.anchorsLayer);
    try {
      shapes.shapesLayer.getCanvas()._canvas.classList.add(SHAPES_LAYER_CLS);
      shapes.anchorsLayer.getCanvas()._canvas.classList.add(ANCHORS_LAYER_CLS);
    } catch (e) {
      console.error("Can't set className to the canvas");
      console.error(e);
    }
    this.stage.on('mousedown', this.handleMouseDown);
    this.stage.on('mouseup', this.handleMouseUp);
    this.stage.on('mousemove', this.handleMouseMove);
    this.stage.on('click', this.handleClick);
  }

  on(key: OnEvtKey, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
  }

  add(layer: Konva.Layer) {
    this.stage.add(layer);
  }

  setAttrs(attrs: { [key: string]: any }) {
    this.stage.setAttrs(attrs);
  }

  draggable(draggable?: boolean): boolean | undefined {
    if (draggable === undefined) {
      return this.stage.draggable();
    }
    this.stage.draggable(draggable);
  }

  absolutePosition(pos?: TPos): TPos | undefined {
    if (pos === undefined) {
      return this.stage.absolutePosition();
    }
    this.stage.absolutePosition(pos);
  }

  getBoundingClientRect(): any {
    return this.stage.container().getBoundingClientRect();
  }

  toDataURL(): string {
    return this.stage.toDataURL();
  }

  getPos(): TPos {
    return {
      x: this.stage.x(),
      y: this.stage.y(),
    };
  }

  width(): number {
    return this.stage.width()!;
  }

  height(): number {
    return this.stage.height()!;
  }

  getContentBoundariesRect(): BoundariesRect {
    const {
      shapes: { list },
    } = canvasStore.getState();
    return calcShapesBoundariesRect(list);
  }

  private handleClick = (e: any) => {
    const { shapes } = canvasStore.getState();
    // While adding shape with irregular form (like Circle)
    // I don't want Stage to receive a click and blur it.
    // (Same problem in `onClick` in Shape.ts)
    if (!shapes.addingShapeRef) {
      canvasStore.dispatch(blurShapes());
    }
  };

  private handleMouseDown = (e: any) => {
    this.cbMap.call('mousedown', e);
  };

  private handleMouseUp = (e: any) => {
    this.cbMap.call('mouseup', e);
  };

  private handleMouseMove = (e: any) => {
    this.cbMap.call('mousemove', e);
  };
}

export default Stage;
