import Konva from 'konva';
import SizeTransformAnchor, { EAnchorTypes } from './SizeTransformAnchor';
import { CallbackMap } from '../../services/CallbackMap';
import canvasStore from '../../store';
import { TPos } from '../../custom';

export type TSizePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class SizeTransformAnchorsGroup {
  private readonly _cbMap: CallbackMap = new CallbackMap();
  private readonly _anchors: {
    leftTop: SizeTransformAnchor;
    rightTop: SizeTransformAnchor;
    rightBottom: SizeTransformAnchor;
    leftBottom: SizeTransformAnchor;
  };

  // Ratio is `width / height`
  private _originRatio: number = 1;

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
    this._anchors = {
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
    this._anchors.leftTop.on('dragmove', this.onMoveAnchor);
    this._anchors.rightTop.on('dragmove', this.onMoveAnchor);
    this._anchors.rightBottom.on('dragmove', this.onMoveAnchor);
    this._anchors.leftBottom.on('dragmove', this.onMoveAnchor);
  }

  private getCurrentAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this._anchors.leftTop;
      case EAnchorTypes.leftBottom:
        return this._anchors.leftBottom;
      case EAnchorTypes.rightTop:
        return this._anchors.rightTop;
      case EAnchorTypes.rightBottom:
        return this._anchors.rightBottom;
      default:
        throw new Error(`Can't find anchor for provided type. Given ${type}`);
    }
  }

  private getOppositeAnchor(type: EAnchorTypes): SizeTransformAnchor {
    switch (type) {
      case EAnchorTypes.leftTop:
        return this._anchors.rightBottom;
      case EAnchorTypes.leftBottom:
        return this._anchors.rightTop;
      case EAnchorTypes.rightTop:
        return this._anchors.leftBottom;
      case EAnchorTypes.rightBottom:
        return this._anchors.leftTop;
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
          neighborX: this._anchors.leftBottom,
          neighborY: this._anchors.rightTop,
        };
      case EAnchorTypes.leftBottom:
        return {
          neighborX: this._anchors.leftTop,
          neighborY: this._anchors.rightBottom,
        };
      case EAnchorTypes.rightTop:
        return {
          neighborX: this._anchors.rightBottom,
          neighborY: this._anchors.leftTop,
        };
      case EAnchorTypes.rightBottom:
        return {
          neighborX: this._anchors.rightTop,
          neighborY: this._anchors.leftBottom,
        };
      default:
        throw new Error(
          `Width and height can't be calculated for the given type: ${type}`,
        );
    }
  }

  private onMoveAnchor = (type: EAnchorTypes, e: any) => {
    const {
      stage: { ratioShiftIsActive, instance },
    } = canvasStore.getState();

    const { layerX, layerY } = e.evt;
    const stageAbsPos = instance?.absolutePosition()!;

    const currentAnchor = this.getCurrentAnchor(type);
    let currentPos: TPos = ratioShiftIsActive
      ? {
          x: layerX - stageAbsPos.x,
          y: layerY - stageAbsPos.y,
        }
      : currentAnchor.getPos();
    const oppositeAnchorPos = this.getOppositeAnchor(type).getPos();

    const horizontalDiff = currentPos.x - oppositeAnchorPos.x;
    const verticalDiff = currentPos.y - oppositeAnchorPos.y;

    const ratioWidth = Math.min(
      Math.abs(horizontalDiff / this._originRatio),
      Math.abs(verticalDiff),
    );
    if (ratioShiftIsActive) {
      currentPos = {
        x:
          oppositeAnchorPos.x +
          Math.sign(horizontalDiff) * ratioWidth * this._originRatio,
        y: oppositeAnchorPos.y + Math.sign(verticalDiff) * ratioWidth,
      };
      currentAnchor.setPos(currentPos);
    }

    const neighborAnchors = this.getNeighborAnchors(type);
    neighborAnchors.neighborX.setPos({ x: currentPos.x });
    neighborAnchors.neighborY.setPos({ y: currentPos.y });

    const leftTop = this.getLeftTopPos();

    this._cbMap.call('dragmove', {
      x: leftTop.x,
      y: leftTop.y,
      width: Math.abs(
        ratioShiftIsActive ? ratioWidth * this._originRatio : horizontalDiff,
      ),
      height: Math.abs(ratioShiftIsActive ? ratioWidth : verticalDiff),
    });
  };

  private getLeftTopPos(): TPos {
    return Object.keys(this._anchors).reduce<TPos>(
      (acc, key) => {
        // @ts-ignore
        const anchor = this._anchors[key] as SizeTransformAnchor;
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
    this._originRatio = originRatio;
  }

  on(key: string, cb: (...rest: any) => void) {
    this._cbMap.set(key, cb);
  }

  updatePosition(shapePos: TSizePosition) {
    this._anchors.leftTop.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftTop,
        shapePos,
      ),
    );
    this._anchors.rightTop.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightTop,
        shapePos,
      ),
    );
    this._anchors.rightBottom.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.rightBottom,
        shapePos,
      ),
    );
    this._anchors.leftBottom.setPos(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        EAnchorTypes.leftBottom,
        shapePos,
      ),
    );
  }

  show() {
    this._anchors.leftTop.show();
    this._anchors.rightTop.show();
    this._anchors.rightBottom.show();
    this._anchors.leftBottom.show();
  }

  hide() {
    this._anchors.leftTop.hide();
    this._anchors.rightTop.hide();
    this._anchors.rightBottom.hide();
    this._anchors.leftBottom.hide();
  }

  addToLayer(anchorsLayer: Konva.Layer) {
    this._anchors.leftTop.addToLayer(anchorsLayer);
    this._anchors.rightTop.addToLayer(anchorsLayer);
    this._anchors.rightBottom.addToLayer(anchorsLayer);
    this._anchors.leftBottom.addToLayer(anchorsLayer);
  }

  destroy() {
    this._anchors.leftTop.destroy();
    this._anchors.rightTop.destroy();
    this._anchors.rightBottom.destroy();
    this._anchors.leftBottom.destroy();
  }
}

export default SizeTransformAnchorsGroup;
