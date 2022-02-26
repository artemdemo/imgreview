import Konva from 'konva';
import _ from 'lodash';
import IShape, { TScaleProps } from '../Shape/IShape';
import TextNode from './TextNode';
import shapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import store from '../../store';
import { drawLayers } from '../../model/shapes/shapesActions';
import { ELayerTypes } from '../../model/shapes/shapesModelTypes';
import { getInnerProductSpace } from '../../services/number';
import { BoundariesRect, TPos } from '../../custom';

type TTextProps = {
  fill: string;
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  rotation?: number;
  fontSize?: number;
};

class Text extends Shape implements IShape {
  type = shapeTypes.TEXT;

  private readonly _props: TTextProps;
  private _textNode: TextNode | undefined;
  private _transformer: Konva.Transformer | undefined;

  constructor(props: TTextProps) {
    super();
    this._props = { ...props };
  }

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    if (!shapesLayer.parent) {
      throw new Error("Layer doesn't have a parent");
    }
    const x = this._props.x || shapesLayer.parent.attrs.width / 2 - 100;
    const y = this._props.y || shapesLayer.parent.attrs.height / 2 - 10;
    this._textNode = new TextNode({
      text: this._props.text || 'Some text here',
      x,
      y,
      fontFamily: 'Lato, Arial',
      fontSize: this._props.fontSize || 20,
      width: this._props.width || 200,
      fill: this._props.fill,
      rotation: this._props.rotation ?? 0,
    });

    this.attachBasicEvents(this._textNode);

    this._textNode.addToLayer(shapesLayer);

    this._transformer = new Konva.Transformer({
      // @ts-ignore
      node: this._textNode.getNode(),
      enabledAnchors: ['middle-left', 'middle-right'],
      borderStroke: '#2196f3',
      anchorStroke: '#2196f3',
      anchorFill: '#ffffff',
      borderStrokeWidth: 1,
      anchorStrokeWidth: 1,
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    this._textNode.on('dblclick', () => {
      this._textNode?.makeEditable();
      this._transformer?.hide();
      store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
      store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
    });

    this._textNode.on('click', this.focus);

    // Listening to transform events.
    // Other examples of these events could be found here:
    // https://konvajs.org/docs/select_and_transform/Transform_Events.html
    this._textNode.on('transform', () => {
      store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
    });

    this._transformer.hide();
    anchorsLayer.add(this._transformer);

    super.addToLayer(shapesLayer, anchorsLayer);
  }

  addToGroup(group: Konva.Group) {
    this._textNode?.addToGroup(group);
  }

  moveToGroup(group: Konva.Group) {
    this._textNode?.remove();
    this._textNode?.setAttr('draggable', false);
    this.addToGroup(group);
  }

  setFillColor(hex: string) {
    this._textNode?.setAttr('fill', hex);
    this._props.fill = hex;
  }

  getFillColor() {
    return this._props.fill;
  }

  setFontSize(fontSize: number) {
    this._textNode?.setAttr('fontSize', fontSize);
    this._props.fontSize = fontSize;
  }

  blur() {
    super.blur();
    this._textNode?.blur();
    this._transformer?.hide();
  }

  focus = () => {
    super.focus();
    this._transformer?.show();
  };

  scale(scaleProps: TScaleProps) {
    if (!this._textNode) {
      throw new Error('`this.textNode` is not defined');
    }
    const position = this._textNode.getPosition();
    this._textNode.setPosition(
      position.x * scaleProps.wFactor,
      position.y * scaleProps.hFactor,
    );
  }

  setAttrs(attrs: any) {
    Object.keys(attrs).forEach((key) => {
      this._textNode?.setAttr(key, attrs[key]);
    });
  }

  crop(cropFramePosition: TPos) {
    if (!this._textNode) {
      throw new Error('`this.textNode` is not defined');
    }
    const position = this._textNode.getPosition();
    this._textNode.setPosition(
      position.x - cropFramePosition.x,
      position.y - cropFramePosition.y,
    );
  }

  draggable(value: boolean): boolean {
    return this._textNode?.draggable(value) ?? false;
  }

  zIndex(idx?: number): number | void {
    if (idx === undefined) {
      return this._textNode?.zIndex();
    }
    this._textNode?.zIndex(idx);
  }

  clone(): Text {
    const text = this._textNode?.getText();
    const rotation = this._textNode?.getRotation();
    const width = _.get(this._textNode?.getAttrs(), 'width');
    return new Text({
      ...this._props,
      ...this._textNode?.getPosition(),
      ...(text && { text }),
      ...(rotation && { rotation }),
      ...(width && { width }),
    });
  }

  getSelfRect(): BoundariesRect {
    if (!this._textNode) {
      throw new Error('TextNode is not defined');
    }
    return this._textNode.getSelfRect();
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    this.setAttrs({
      x: startPos.x,
      y: startPos.y,
      rotation: getInnerProductSpace(startPos, currentPos) * (180 / Math.PI),
    });
    store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
  }

  destroy() {
    this._textNode?.destroy();
    this._transformer?.destroy();
  }
}

export default Text;
