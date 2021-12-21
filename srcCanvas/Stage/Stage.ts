import Konva, { TPos } from 'konva';
import canvasStore from '../store';
import { TCanvasState } from '../reducers';
import {
  ANCHORS_LAYER_CLS,
  IMAGE_LAYER_CLS,
  SHAPES_LAYER_CLS,
} from '../model/shapes/shapesConst';

class Stage {
  private readonly stage: Konva.Stage;
  private readonly cbMap: Map<string, (...args: any) => void> = new Map();

  constructor(el: HTMLDivElement) {
    this.stage = new Konva.Stage({
      container: el,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const { shapes, image } = canvasStore.getState() as TCanvasState;
    this.stage.add(image.layer);
    this.stage.add(shapes.shapesLayer);
    this.stage.add(shapes.anchorsLayer);
    try {
      image.layer.getCanvas()._canvas.classList.add(IMAGE_LAYER_CLS);
      shapes.shapesLayer.getCanvas()._canvas.classList.add(SHAPES_LAYER_CLS);
      shapes.anchorsLayer.getCanvas()._canvas.classList.add(ANCHORS_LAYER_CLS);
    } catch (e) {
      console.error("Can't set className to the canvas");
      console.error(e);
    }
    this.stage.on('mousedown', this.handleStageOnMouseDown);
    this.stage.on('mouseup', this.handleStageOnMouseUp);
    this.stage.on('mousemove', this.handleStageOnMouseMove);
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

  private handleStageOnMouseDown = (e: any) => {
    const mousedownCb = this.cbMap.get('mousedown');
    mousedownCb && mousedownCb(e);
  };

  private handleStageOnMouseUp = (e: any) => {
    const mouseupCb = this.cbMap.get('mouseup');
    mouseupCb && mouseupCb(e);
  };

  private handleStageOnMouseMove = (e: any) => {
    const mousemoveCb = this.cbMap.get('mousemove');
    mousemoveCb && mousemoveCb(e);
  };
}

export default Stage;
