import Konva from 'konva';
import { CallbackMap } from '../../services/CallbackMap';
import { TPos } from '../../custom';

const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const MAX_HEAD_LEN = 14;
const MIN_HEAD_ANGLE = 20;
const MAX_HEAD_ANGLE = 40;

class ArrowHead {
  // Trigonometry calculation of 3 points of the arrow head
  // See `ArrowHead-schema.jpg` for variables definition
  static calculateHeadPoints(
    startAnchorPos: TPos,
    controlAnchorPos: TPos,
    strokeWidth: number,
  ) {
    const rightArmPos: TPos = { x: 0, y: 0 };
    const leftArmPos: TPos = { x: 0, y: 0 };

    let anchorAngle: number;
    const anchorXdiff = startAnchorPos.x - controlAnchorPos.x;
    const anchorYdiff = startAnchorPos.y - controlAnchorPos.y;

    if (anchorXdiff === 0) {
      if (startAnchorPos.y < controlAnchorPos.y) {
        // When arrow is pointing up (start is above control)
        // Y-axis is starting from top left corner, it means that in this case
        // `startAnchorPos.y` will be smaller than `controlAnchorPos.y`
        anchorAngle = degToRad(90);
      } else {
        // When arrow is pointing down (start is below control)
        anchorAngle = degToRad(270);
      }
    } else {
      anchorAngle = Math.atan(anchorYdiff / anchorXdiff);
      if (anchorXdiff > 0) {
        anchorAngle += degToRad(180);
      }
    }

    const headAngle = strokeWidth * 10;
    const headAngleRad = degToRad(
      Math.min(
        MAX_HEAD_ANGLE,
        headAngle < MIN_HEAD_ANGLE ? MIN_HEAD_ANGLE : headAngle,
      ),
    );

    const headLenResult = Math.min(MAX_HEAD_LEN, strokeWidth * 4.5);

    const rightArmAngle = headAngleRad - anchorAngle;
    rightArmPos.x = startAnchorPos.x + headLenResult * Math.cos(rightArmAngle);
    rightArmPos.y = startAnchorPos.y - headLenResult * Math.sin(rightArmAngle);

    const leftArmAngle = degToRad(90) - (anchorAngle + headAngleRad);
    leftArmPos.x = startAnchorPos.x + headLenResult * Math.sin(leftArmAngle);
    leftArmPos.y = startAnchorPos.y + headLenResult * Math.cos(leftArmAngle);

    return [
      leftArmPos.x,
      leftArmPos.y,
      startAnchorPos.x,
      startAnchorPos.y,
      rightArmPos.x,
      rightArmPos.y,
    ];
  }

  private readonly _arrowHead: Konva.Line;
  private readonly _cbMap: CallbackMap = new CallbackMap();
  private readonly _delta: TPos;
  private readonly _appliedDelta: TPos;

  constructor(props: any) {
    this._arrowHead = new Konva.Line({
      lineCap: 'round',
      lineJoin: 'round',
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      points: ArrowHead.calculateHeadPoints(
        props.start,
        props.control,
        props.strokeWidth,
      ),
    });

    this._arrowHead.on('click', (e) => {
      this._cbMap.call('click', e);
    });
    this._arrowHead.on('mouseover', (e) => {
      this._cbMap.call('mouseover', e);
    });
    this._arrowHead.on('mouseout', (e) => {
      this._cbMap.call('mouseout', e);
    });

    this._delta = { x: 0, y: 0 };
    this._appliedDelta = { x: 0, y: 0 };
  }

  /**
   * Set callback
   * @param key {string}
   * @param cb {function}
   */
  on = (key: string, cb: (e: any) => void) => {
    this._cbMap.set(key, cb);
  };

  update(startAnchorPos: TPos, controlAnchorPos: TPos, strokeWidth: number) {
    this._arrowHead.points(
      ArrowHead.calculateHeadPoints(
        startAnchorPos,
        controlAnchorPos,
        strokeWidth,
      ),
    );
    this._arrowHead.setAttrs({
      x: 0,
      y: 0,
      strokeWidth,
    });
    this._arrowHead.draw();

    this._appliedDelta.x = this._delta.x;
    this._appliedDelta.y = this._delta.y;
  }

  draw() {
    this._arrowHead.draw();
  }

  zIndex(idx: number) {
    this._arrowHead?.zIndex(idx);
  }

  setDelta(deltaX = 0, deltaY = 0) {
    this._arrowHead.setAttr('x', deltaX - this._appliedDelta.x);
    this._arrowHead.setAttr('y', deltaY - this._appliedDelta.y);
    this._delta.x = deltaX;
    this._delta.y = deltaY;
  }

  setAttr(name: string, value: any) {
    this._arrowHead.setAttr(name, value);
  }

  /**
   * @public
   */
  addToLayer(layer: Konva.Layer) {
    layer.add(this._arrowHead);
  }

  /**
   * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    this._arrowHead.destroy();
  }
}

export default ArrowHead;
