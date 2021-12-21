import Konva, { TPos } from 'konva';
import canvasStore from '../store';
import { TCanvasState } from '../reducers';
import {
  ANCHORS_LAYER_CLS,
  SHAPES_LAYER_CLS,
} from '../model/shapes/shapesConst';
import {CallbackMap} from '../services/CallbackMap';
import {blurShapes} from '../model/shapes/shapesActions';

class Stage {
  private readonly stage: Konva.Stage;
  private readonly cbMap: CallbackMap = new CallbackMap();

  constructor(el: HTMLDivElement) {
    this.stage = new Konva.Stage({
      container: el,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const { shapes } = canvasStore.getState() as TCanvasState;
    this.stage.add(shapes.shapesLayer);
    this.stage.add(shapes.anchorsLayer);
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

  on(key: string, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
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

  private handleClick = (e: any) => {
    canvasStore.dispatch(blurShapes());
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
