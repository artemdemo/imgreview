import Konva, { TPos } from 'konva';
import SizeTransformAnchor, { EAnchorTypes } from './SizeTransformAnchor';
import { CallbackMap } from '../../services/CallbackMap';
import canvasStore from '../../store';
import { TCanvasState } from '../../reducers';

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

  // Ratio is `width / height`
  #originRatio: number = 1;

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
          attrs,
        ),
        type: EAnchorTypes.leftTop,
      }),
      rightTop: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightTop,
          attrs,
        ),
        type: EAnchorTypes.rightTop,
      }),
      rightBottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.rightBottom,
          attrs,
        ),
        type: EAnchorTypes.rightBottom,
      }),
      leftBottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          EAnchorTypes.leftBottom,
          attrs,
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
        return this.#anchors.rightBottom;
      case EAnchorTypes.leftBottom:
        return this.#anchors.rightTop;
      case EAnchorTypes.rightTop:
        return this.#anchors.leftBottom;
      case EAnchorTypes.rightBottom:
        return this.#anchors.leftTop;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private getNeighborAnchors(type: EAnchorTypes): {
    neighborX: SizeTransformAnchor;
    neighborY: SizeTransformAnchor;
  } {
    switch (type) {
      case EAnchorTypes.leftTop:
        return {
          neighborX: this.#anchors.leftBottom,
          neighborY: this.#anchors.rightTop,
        };
      case EAnchorTypes.leftBottom:
        return {
          neighborX: this.#anchors.leftTop,
          neighborY: this.#anchors.rightBottom,
        };
      case EAnchorTypes.rightTop:
        return {
          neighborX: this.#anchors.rightBottom,
          neighborY: this.#anchors.leftTop,
        };
      case EAnchorTypes.rightBottom:
        return {
          neighborX: this.#anchors.rightTop,
          neighborY: this.#anchors.leftBottom,
        };
      default:
        throw new Error(
          `Width and height can't be calculated for the given type: ${type}`,
        );
    }
  }

  private onMoveAnchor = (type: EAnchorTypes, e: any) => {
    const {
      stage: { ratioShiftIsActive },
    } = canvasStore.getState();

    const { layerX, layerY } = e.evt;

    const currentAnchor = this.getCurrentAnchor(type);
    let currentPos: TPos = ratioShiftIsActive
      ? {
          x: layerX,
          y: layerY,
        }
      : currentAnchor.getPos();
    const oppositeAnchorPos = this.getOppositeAnchor(type).getPos();

    const horizontalDiff = currentPos.x - oppositeAnchorPos.x;
    const verticalDiff = currentPos.y - oppositeAnchorPos.y;

    const ratioWidth = Math.min(
      Math.abs(horizontalDiff / this.#originRatio),
      Math.abs(verticalDiff),
    );
    if (ratioShiftIsActive) {
      currentPos = {
        x:
          oppositeAnchorPos.x +
          Math.sign(horizontalDiff) * ratioWidth * this.#originRatio,
        y: oppositeAnchorPos.y + Math.sign(verticalDiff) * ratioWidth,
      };
      currentAnchor.setPos(currentPos);
    }

    const neighborAnchors = this.getNeighborAnchors(type);
    neighborAnchors.neighborX.setPos({ x: currentPos.x });
    neighborAnchors.neighborY.setPos({ y: currentPos.y });

    const leftTop = this.getLeftTopPos();

    this.#cbMap.call('dragmove', {
      x: leftTop.x,
      y: leftTop.y,
      width: Math.abs(
        ratioShiftIsActive ? ratioWidth * this.#originRatio : horizontalDiff,
      ),
      height: Math.abs(ratioShiftIsActive ? ratioWidth : verticalDiff),
    });
  };

  private getLeftTopPos(): TPos {
    return Object.keys(this.#anchors).reduce<TPos>(
      (acc, key) => {
        // @ts-ignore
        const anchor = this.#anchors[key] as SizeTransformAnchor;
        const anchorPos = anchor.getPos();
        if (anchorPos.x < acc.x || anchorPos.y < acc.y) {
          return anchorPos;
        }
        return acc;
      },
      { x: Infinity, y: Infinity },
    );
  }

  setOriginRatio(originRatio: number) {
    this.#originRatio = originRatio;
  }

  on(key: string, cb: (...rest: any) => void) {
    this.#cbMap.set(key, cb);
  }

  updatePosition(shapePos: TSizePosition) {
    this.#anchors.leftTop.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftTop,
        shapePos,
      ),
    );
    this.#anchors.rightTop.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightTop,
        shapePos,
      ),
    );
    this.#anchors.rightBottom.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightBottom,
        shapePos,
      ),
    );
    this.#anchors.leftBottom.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftBottom,
        shapePos,
      ),
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
