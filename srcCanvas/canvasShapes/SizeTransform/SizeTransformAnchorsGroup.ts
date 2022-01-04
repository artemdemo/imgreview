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

  // Where to place anchors - in corners or in the middle of the edge
  readonly #inCorner: boolean;

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

  constructor(attrs: TSizePosition, inCorner: boolean) {
    this.#anchors = {
      left: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          inCorner ? EAnchorTypes.leftTop : EAnchorTypes.left,
          attrs
        ),
        type: inCorner ? EAnchorTypes.leftTop : EAnchorTypes.left,
      }),
      top: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          inCorner ? EAnchorTypes.rightTop : EAnchorTypes.top,
          attrs
        ),
        type: inCorner ? EAnchorTypes.rightTop : EAnchorTypes.top,
      }),
      right: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          inCorner ? EAnchorTypes.rightBottom : EAnchorTypes.right,
          attrs
        ),
        type: inCorner ? EAnchorTypes.rightBottom : EAnchorTypes.right,
      }),
      bottom: new SizeTransformAnchor({
        ...SizeTransformAnchorsGroup.calcAnchorPosition(
          inCorner ? EAnchorTypes.leftBottom : EAnchorTypes.bottom,
          attrs
        ),
        type: inCorner ? EAnchorTypes.leftBottom : EAnchorTypes.bottom,
      }),
    };
    this.#inCorner = inCorner;
    this.#anchors.left.on('dragmove', this.onMoveAnchor);
    this.#anchors.top.on('dragmove', this.onMoveAnchor);
    this.#anchors.right.on('dragmove', this.onMoveAnchor);
    this.#anchors.bottom.on('dragmove', this.onMoveAnchor);
  }

  private moveMiddleAnchor(type: EAnchorTypes) {
    const leftAnchorPos = this.#anchors.left.getCenterPosition();
    const topAnchorPos = this.#anchors.top.getCenterPosition();
    const rightAnchorPos = this.#anchors.right.getCenterPosition();
    const bottomAnchorPos = this.#anchors.bottom.getCenterPosition();

    const width = rightAnchorPos.x - leftAnchorPos.x;
    const height = bottomAnchorPos.y - topAnchorPos.y;
    const topPos = height < 0 ? bottomAnchorPos : topAnchorPos;
    const leftPos = width < 0 ? rightAnchorPos : leftAnchorPos;

    // Now while moving one anchor I need to update others, because they are sitting on the frame
    if (type === EAnchorTypes.left || type === EAnchorTypes.right) {
      this.#anchors.top.setCenterPosition({
        x: leftAnchorPos.x + width / 2,
      });
      this.#anchors.bottom.setCenterPosition({
        x: leftAnchorPos.x + width / 2,
      });
    } else if (type === EAnchorTypes.top || type === EAnchorTypes.bottom) {
      this.#anchors.left.setCenterPosition({
        y: topAnchorPos.y + height / 2,
      });
      this.#anchors.right.setCenterPosition({
        y: topAnchorPos.y + height / 2,
      });
    }

    this.#cbMap.call('dragmove', {
      x: leftPos.x,
      y: topPos.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }

  private moveCornerAnchor(type: EAnchorTypes) {
    const { stage: { ratioShiftIsActive } } = canvasStore.getState() as TCanvasState;
    const leftTopAnchorPos = this.#anchors.left.getCenterPosition();
    const rightTopAnchorPos = this.#anchors.top.getCenterPosition();
    const rightBottomAnchorPos = this.#anchors.right.getCenterPosition();
    const leftBottomAnchorPos = this.#anchors.bottom.getCenterPosition();

    let horizontalDiff = 0;
    let verticalDiff = 0;

    switch (type) {
      case EAnchorTypes.leftTop:
        horizontalDiff = rightTopAnchorPos.x - leftTopAnchorPos.x;
        verticalDiff = leftBottomAnchorPos.y - leftTopAnchorPos.y;
        // Now I need to move "partner anchors"
        // For leftTop it will be: leftBottom and rightTop
        this.#anchors.bottom.setCenterPosition({
          // bottom, leftBottom
          x: leftTopAnchorPos.x,
        });
        this.#anchors.top.setCenterPosition({
          // top, rightTop
          y: leftTopAnchorPos.y,
        });
        break;
      case EAnchorTypes.leftBottom:
        horizontalDiff = rightBottomAnchorPos.x - leftBottomAnchorPos.x;
        verticalDiff = leftBottomAnchorPos.y - leftTopAnchorPos.y;
        this.#anchors.left.setCenterPosition({
          // left, leftTop
          x: leftBottomAnchorPos.x,
        });
        this.#anchors.right.setCenterPosition({
          // right, rightBottom
          y: leftBottomAnchorPos.y,
        });
        break;
      case EAnchorTypes.rightTop:
        horizontalDiff = rightTopAnchorPos.x - leftTopAnchorPos.x;
        verticalDiff = rightBottomAnchorPos.y - rightTopAnchorPos.y;
        this.#anchors.left.setCenterPosition({
          // left, leftTop
          y: rightTopAnchorPos.y,
        });
        this.#anchors.right.setCenterPosition({
          // right, rightBottom
          x: rightTopAnchorPos.x,
        });
        break;
      case EAnchorTypes.rightBottom:
        horizontalDiff = rightBottomAnchorPos.x - leftBottomAnchorPos.x;
        verticalDiff = rightBottomAnchorPos.y - rightTopAnchorPos.y;
        this.#anchors.top.setCenterPosition({
          // top, rightTop
          x: rightBottomAnchorPos.x,
        });
        this.#anchors.bottom.setCenterPosition({
          // bottom, leftBottom
          y: rightBottomAnchorPos.y,
        });
        break;
      default:
        throw new Error(
          `Width and height can't be calculated for the given type: ${type}`
        );
    }

    let leftTop;

    if (verticalDiff < 0) {
      leftTop = horizontalDiff < 0 ? rightBottomAnchorPos : leftBottomAnchorPos;
    } else {
      leftTop = horizontalDiff < 0 ? rightTopAnchorPos : leftTopAnchorPos;
    }

    this.#cbMap.call('dragmove', {
      x: leftTop.x,
      y: leftTop.y,
      width: Math.abs(horizontalDiff),
      height: Math.abs(verticalDiff),
    });
  }

  private onMoveAnchor = (type: EAnchorTypes) => {
    if (this.#inCorner) {
      this.moveCornerAnchor(type);
    } else {
      this.moveMiddleAnchor(type);
    }
  };

  on(key: string, cb: (...rest: any) => void) {
    this.#cbMap.set(key, cb);
  }

  updatePosition(shapePos: TSizePosition) {
    this.#anchors.left.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        this.#inCorner ? EAnchorTypes.leftTop : EAnchorTypes.left,
        shapePos
      )
    );
    this.#anchors.top.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        this.#inCorner ? EAnchorTypes.rightTop : EAnchorTypes.top,
        shapePos
      )
    );
    this.#anchors.right.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        this.#inCorner ? EAnchorTypes.rightBottom : EAnchorTypes.right,
        shapePos
      )
    );
    this.#anchors.bottom.setCenterPosition(
      SizeTransformAnchorsGroup.calcAnchorPosition(
        this.#inCorner ? EAnchorTypes.leftBottom : EAnchorTypes.bottom,
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
