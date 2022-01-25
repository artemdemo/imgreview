import Konva, { TPos } from 'konva';
import TextNode from '../Text/TextNode';
import shapeTypes from './shapeTypes';
import { CallbackMap } from '../../services/CallbackMap';
import canvasStore from '../../store';
import { shapeClicked, shapeDragStarted } from '../../api/events';

class Shape {
  type = shapeTypes.SHAPE;
  readonly cbMap: CallbackMap = new CallbackMap();

  private _isSelected: boolean = false;

  blur() {
    this._isSelected = false;
  }

  focus() {
    this._isSelected = true;
  }

  isSelected(): boolean {
    return this._isSelected;
  }

  on(key: string, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    this.focus();
  }

  clone() {
    console.warn('clone() is not implemented');
    console.warn(this);
  }

  crop(cropFramePosition: TPos) {
    console.warn('crop() is not implemented');
    console.warn(this);
  }

  draggable(value: boolean) {
    console.warn('draggable() is not implemented');
    console.warn(this);
  }

  attachBasicEvents(node: Konva.Rect | Konva.Path | Konva.Image | TextNode) {
    node.on('click', this.onClick);
    node.on('dragstart', this.onDragStart);
    node.on('mouseover', () => {
      this.cbMap.call('mouseover', this);
    });
    node.on('mouseout', () => {
      this.cbMap.call('mouseout', this);
    });
  }

  onClick = (e: any) => {
    const { shapes } = canvasStore.getState();
    // The problem is with shapes that not cover whole adding area, like Circle.
    // When you're adding it - you start from empty space and end in empty space.
    // It means that shape under it will receive click.
    // So I'm checking whether there is `addingShapeRef` and not allowing click in case there is one.
    // (Same problem in `handleClick` in Stage.ts)
    if (!shapes.addingShapeRef) {
      shapeClicked(this);
      e.cancelBubble = true;
      this.focus();
      this.cbMap.call('click', this);
    }
  };

  onDragStart = () => {
    shapeDragStarted(this);
    this.focus();
    this.cbMap.call('dragstart', this);
  };

  destroy() {
    this.cbMap.call('_beforedestroy', this);
  }
}

export default Shape;
