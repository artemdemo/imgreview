import Konva, { TPos } from 'konva';
import SizeTransformAnchor, { EAnchorTypes } from './SizeTransformAnchor';
import { CallbackMap } from '../../services/CallbackMap';
import canvasStore from '../../store';
import {TCanvasState} from '../../reducers';

export type TSizePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class SizeTransformAnchorsGroup {
  readonly #cbMap: CallbackMap = new CallbackMap();
  readonly #anchors: {
    left: SizeTransformAnchor; // left, leftTop
    top: SizeTransformAnchor; // top, rightTop
    right: SizeTransformAnchor; // right, rightBottom
    bottom: SizeTransformAnchor; // bottom, leftBottom
  };

  static calcAnchorPosition(type: EAnchorTypes, sizePos: TSizePosition): TPos {
    switch (type) {
      case EAnchorTypes.left:
        return {
          x: sizePos.x,
          y: sizePos.y + sizePos.height / 2,
        };
      case EAnchorTypes.top:
        return {
          x: sizePos.x + sizePos.width / 2,
          y: sizePos.y,
        };
      case EAnchorTypes.right:
        return {
          x: sizePos.x + sizePos.width,
          y: sizePos.y + sizePos.height / 2,
        };
      case EAnchorTypes.bottom:
        return {
          x: sizePos.x + sizePos.width / 2,
          y: sizePos.y + sizePos.height,
        };
      case EAnchorTypes.leftTop:
        return {
          x: sizePos.x,
          y: sizePos.y,
        };
      case EAnchorTypes.rightTop:
        return {
          x: sizePos.x + sizePos.width,
          y: sizePos.y,
        };
      case EAnchorTypes.rightBottom:
        return {
          x: sizePos.x + sizePos.width,
          y: sizePos.y + sizePos.height,
        };
      case EAnchorTypes.leftBottom:
        return {
          x: sizePos.x,
          y: sizePos.y + sizePos.height,
        };
      default:
        throw new Error(`Position can't be calculated for given type: ${type}`);
    }
  }

  constructor(attrs: TSizePosition) {
    this.#anchors = {
      left: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.leftTop,
          attrs
        ),
        type: EAnchorTypes.leftTop,
      }),
      top: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightTop,
          attrs
        ),
        type: EAnchorTypes.rightTop,
      }),
      right: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightBottom,
          attrs
        ),
        type: EAnchorTypes.rightBottom,
      }),
      bottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.leftBottom,
          attrs
        ),
        type: EAnchorTypes.leftBottom,
      }),
    };
    this.#anchors.left.on('dragmove', this.onMoveAnchor);
    this.#anchors.top.on('dragmove', this.onMoveAnchor);
    this.#anchors.right.on('dragmove', this.onMoveAnchor);
    this.#anchors.bottom.on('dragmove', this.onMoveAnchor);
  }

  private getCurrentAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this.#anchors.left;
      case EAnchorTypes.leftBottom:
        return this.#anchors.bottom;
      case EAnchorTypes.rightTop:
        return this.#anchors.top;
      case EAnchorTypes.rightBottom:
        return this.#anchors.right;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private getOppositeAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this.#anchors.right
      case EAnchorTypes.leftBottom:
        return this.#anchors.top
      case EAnchorTypes.rightTop:
        return this.#anchors.bottom;
      case EAnchorTypes.rightBottom:
        return this.#anchors.left;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private moveCornerAnchor(type: EAnchorTypes) {
    const { stage: { ratioShiftIsActive } } = canvasStore.getState() as TCanvasState;
    const leftTopAnchorPos = this.#anchors.left.getCenterPosition();
    const rightTopAnchorPos = this.#anchors.top.getCenterPosition();
    const rightBottomAnchorPos = this.#anchors.right.getCenterPosition();
    const leftBottomAnchorPos = this.#anchors.bottom.getCenterPosition();

    const currentAnchorPos = this.getCurrentAnchor(type).getCenterPosition();
    const oppositeAnchorPos = this.getOppositeAnchor(type).getCenterPosition();

    let horizontalDiff = currentAnchorPos.x - oppositeAnchorPos.x;
    let verticalDiff = currentAnchorPos.y - oppositeAnchorPos.y;

    switch (type) {
      case EAnchorTypes.leftTop:
        // Now I need to move "partner anchors"
        // For leftTop it will be: leftBottom and rightTop
        this.#anchors.bottom.setCenterPosition({
          // leftBottom
          x: leftTopAnchorPos.x,
        });
        this.#anchors.top.setCenterPosition({
          // rightTop
          y: leftTopAnchorPos.y,
        });
        break;
      case EAnchorTypes.leftBottom:
        this.#anchors.left.setCenterPosition({
          // leftTop
          x: leftBottomAnchorPos.x,
        });
        this.#anchors.right.setCenterPosition({
          // rightBottom
          y: leftBottomAnchorPos.y,
        });
        break;
      case EAnchorTypes.rightTop:
        this.#anchors.left.setCenterPosition({
          // leftTop
          y: rightTopAnchorPos.y,
        });
        this.#anchors.right.setCenterPosition({
          // rightBottom
          x: rightTopAnchorPos.x,
        });
        break;
      case EAnchorTypes.rightBottom:
        this.#anchors.top.setCenterPosition({
          // rightTop
          x: rightBottomAnchorPos.x,
        });
        this.#anchors.bottom.setCenterPosition({
          // leftBottom
          y: rightBottomAnchorPos.y,
        });
        break;
      default:
        throw new Error(
          `Width and height can't be calculated for the given type: ${type}`
        );
    }

    const leftTop = this.getLeftTopPos();

    this.#cbMap.call('dragmove', {
      x: leftTop.x,
      y: leftTop.y,
      width: Math.abs(horizontalDiff),
      height: Math.abs(verticalDiff),
    });
  }

  private getLeftTopPos(): TPos {
    return Object.keys(this.#anchors).reduce<TPos>((acc, key) => {
      // @ts-ignore
      const anchor = this.#anchors[key] as SizeTransformAnchor;
      const anchorPos = anchor.getCenterPosition();
      if (anchorPos.x < acc.x || anchorPos.y < acc.y) {
        return anchorPos;
      }
      return acc;
    }, { x: Infinity, y: Infinity });
  }

  private onMoveAnchor = (type: EAnchorTypes) => {
    this.moveCornerAnchor(type);
  };

  on(key: string, cb: (...rest: any) => void) {
    this.#cbMap.set(key, cb);
  }

  updatePosition(shapePos: TSizePosition) {
    this.#anchors.left.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftTop,
        shapePos
      )
    );
    this.#anchors.top.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightTop,
        shapePos
      )
    );
    this.#anchors.right.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightBottom,
        shapePos
      )
    );
    this.#anchors.bottom.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftBottom,
        shapePos
      )
    );
  }

  show() {
    this.#anchors.left.show();
    this.#anchors.top.show();
    this.#anchors.right.show();
    this.#anchors.bottom.show();
  }

  hide() {
    this.#anchors.left.hide();
    this.#anchors.top.hide();
    this.#anchors.right.hide();
    this.#anchors.bottom.hide();
  }

  addToLayer(anchorsLayer: Konva.Layer) {
    this.#anchors.left.addToLayer(anchorsLayer);
    this.#anchors.top.addToLayer(anchorsLayer);
    this.#anchors.right.addToLayer(anchorsLayer);
    this.#anchors.bottom.addToLayer(anchorsLayer);
  }

  destroy() {
    this.#anchors.left.destroy();
    this.#anchors.top.destroy();
    this.#anchors.right.destroy();
    this.#anchors.bottom.destroy();
  }
}

export default SizeTransformAnchorsGroup;
