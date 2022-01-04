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
    leftTop: SizeTransformAnchor;
    rightTop: SizeTransformAnchor;
    rightBottom: SizeTransformAnchor;
    leftBottom: SizeTransformAnchor;
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
      leftTop: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.leftTop,
          attrs
        ),
        type: EAnchorTypes.leftTop,
      }),
      rightTop: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightTop,
          attrs
        ),
        type: EAnchorTypes.rightTop,
      }),
      rightBottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightBottom,
          attrs
        ),
        type: EAnchorTypes.rightBottom,
      }),
      leftBottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.leftBottom,
          attrs
        ),
        type: EAnchorTypes.leftBottom,
      }),
    };
    this.#anchors.leftTop.on('dragmove', this.onMoveAnchor);
    this.#anchors.rightTop.on('dragmove', this.onMoveAnchor);
    this.#anchors.rightBottom.on('dragmove', this.onMoveAnchor);
    this.#anchors.leftBottom.on('dragmove', this.onMoveAnchor);
  }

  private getCurrentAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this.#anchors.leftTop;
      case EAnchorTypes.leftBottom:
        return this.#anchors.leftBottom;
      case EAnchorTypes.rightTop:
        return this.#anchors.rightTop;
      case EAnchorTypes.rightBottom:
        return this.#anchors.rightBottom;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private getOppositeAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this.#anchors.rightBottom
      case EAnchorTypes.leftBottom:
        return this.#anchors.rightTop
      case EAnchorTypes.rightTop:
        return this.#anchors.leftBottom;
      case EAnchorTypes.rightBottom:
        return this.#anchors.leftTop;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private moveCornerAnchor(type: EAnchorTypes) {
    const { stage: { ratioShiftIsActive } } = canvasStore.getState() as TCanvasState;

    const currentAnchor = this.getCurrentAnchor(type);
    let currentAnchorPos: TPos = currentAnchor.getCenterPosition();
    const oppositeAnchorPos = this.getOppositeAnchor(type).getCenterPosition();

    const horizontalDiff = currentAnchorPos.x - oppositeAnchorPos.x;
    const verticalDiff = currentAnchorPos.y - oppositeAnchorPos.y;

    const ratioWidth = Math.min(
      Math.abs(horizontalDiff),
      Math.abs(verticalDiff),
    );

    if (ratioShiftIsActive) {
      currentAnchorPos = {
        x: oppositeAnchorPos.x + Math.sign(horizontalDiff) * ratioWidth,
        y: oppositeAnchorPos.y + Math.sign(verticalDiff) * ratioWidth,
      };
      currentAnchor.setCenterPosition(currentAnchorPos);
    }

    switch (type) {
      case EAnchorTypes.leftTop:
        // Now I need to move "partner anchors"
        // For leftTop it will be: leftBottom and rightTop
        this.#anchors.leftBottom.setCenterPosition({
          x: currentAnchorPos.x,
        });
        this.#anchors.rightTop.setCenterPosition({
          y: currentAnchorPos.y,
        });
        break;
      case EAnchorTypes.leftBottom:
        this.#anchors.leftTop.setCenterPosition({
          x: currentAnchorPos.x,
        });
        this.#anchors.rightBottom.setCenterPosition({
          y: currentAnchorPos.y,
        });
        break;
      case EAnchorTypes.rightTop:
        this.#anchors.leftTop.setCenterPosition({
          y: currentAnchorPos.y,
        });
        this.#anchors.rightBottom.setCenterPosition({
          x: currentAnchorPos.x,
        });
        break;
      case EAnchorTypes.rightBottom:
        this.#anchors.rightTop.setCenterPosition({
          x: currentAnchorPos.x,
        });
        this.#anchors.leftBottom.setCenterPosition({
          y: currentAnchorPos.y,
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
      width: Math.abs(ratioShiftIsActive ? ratioWidth : horizontalDiff),
      height: Math.abs(ratioShiftIsActive ? ratioWidth : verticalDiff),
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
    this.#anchors.leftTop.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftTop,
        shapePos
      )
    );
    this.#anchors.rightTop.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightTop,
        shapePos
      )
    );
    this.#anchors.rightBottom.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightBottom,
        shapePos
      )
    );
    this.#anchors.leftBottom.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftBottom,
        shapePos
      )
    );
  }

  show() {
    this.#anchors.leftTop.show();
    this.#anchors.rightTop.show();
    this.#anchors.rightBottom.show();
    this.#anchors.leftBottom.show();
  }

  hide() {
    this.#anchors.leftTop.hide();
    this.#anchors.rightTop.hide();
    this.#anchors.rightBottom.hide();
    this.#anchors.leftBottom.hide();
  }

  addToLayer(anchorsLayer: Konva.Layer) {
    this.#anchors.leftTop.addToLayer(anchorsLayer);
    this.#anchors.rightTop.addToLayer(anchorsLayer);
    this.#anchors.rightBottom.addToLayer(anchorsLayer);
    this.#anchors.leftBottom.addToLayer(anchorsLayer);
  }

  destroy() {
    this.#anchors.leftTop.destroy();
    this.#anchors.rightTop.destroy();
    this.#anchors.rightBottom.destroy();
    this.#anchors.leftBottom.destroy();
  }
}

export default SizeTransformAnchorsGroup;
