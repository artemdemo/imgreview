import Konva, { TPos } from 'konva';
import * as api from '../api';
import TextNode from '../Text/TextNode';
import shapeTypes from './shapeTypes';
import { shapeDragStarted } from '../api';
import { CallbackMap } from '../services/CallbackMap';

class Shape {
  type = shapeTypes.SHAPE;
  readonly cbMap: CallbackMap = new CallbackMap();

  #isSelected: boolean = false;
  #isConnected: boolean = false;

  blur() {
    this.#isSelected = false;
  }

  focus() {
    this.#isSelected = true;
  }

  isSelected(): boolean {
    return this.#isSelected;
  }

  isConnected(): boolean {
    return this.#isConnected;
  }

  on(key: string, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    this.#isConnected = true;
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
    api.shapeClicked(this);
    e.cancelBubble = true;
    this.focus();
    this.cbMap.call('click', this);
  };

  onDragStart = () => {
    api.shapeDragStarted(this);
    this.focus();
    this.cbMap.call('dragstart', this);
  };

  destroy() {
    this.cbMap.call('_beforedestroy', this);
  }
}

export default Shape;
