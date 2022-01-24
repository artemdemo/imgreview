import Konva, { TPos } from 'konva';
import { CallbackMap } from '../../services/CallbackMap';

export enum EAnchorTypes {
  left = 'left',
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  leftTop = 'leftTop',
  leftBottom = 'leftBottom',
  rightTop = 'rightTop',
  rightBottom = 'rightBottom',
}

type TAttrs = {
  x: number;
  y: number;
  type: EAnchorTypes;
};

const RECT_PROPS = {
  width: 10,
  height: 10,
  stroke: '#2196f3',
  strokeWidth: 1,
  fill: '#ffffff',
  draggable: true,
};

class SizeTransformAnchor {
  private readonly cbMap: CallbackMap = new CallbackMap();
  private readonly anchor: Konva.Rect;
  private readonly attrs: TAttrs;

  constructor(attrs: TAttrs) {
    this.attrs = attrs;

    this.anchor = new Konva.Rect({
      ...RECT_PROPS,
      x: attrs.x - RECT_PROPS.width / 2,
      y: attrs.y - RECT_PROPS.height / 2,
      dragBoundFunc(pos) {
        return {
          x: pos.x,
          y: pos.y,
        };
      },
    });

    this.anchor.on('dragmove', this.onDragMove);
  }

  private onDragMove = (e: any) => {
    this.cbMap.call('dragmove', this.attrs.type, e);
  };

  show() {
    this.anchor.visible(true);
  }

  hide() {
    this.anchor.visible(false);
  }

  on(key: string, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
  }

  getPos(): TPos {
    const attrs = this.anchor.getAttrs();
    return {
      x: attrs.x + RECT_PROPS.width / 2,
      y: attrs.y + RECT_PROPS.height / 2,
    };
  }

  setPos(pos: { x?: number; y?: number }) {
    const currentCentPosition = this.getPos();
    const x = pos.x || currentCentPosition.x;
    const y = pos.y || currentCentPosition.y;
    this.anchor.setAttrs({
      x: x - RECT_PROPS.width / 2,
      y: y - RECT_PROPS.height / 2,
    });
  }

  addToLayer(layer: Konva.Layer) {
    layer.add(this.anchor);
  }

  destroy() {
    this.anchor.destroy();
  }
}

export default SizeTransformAnchor;
