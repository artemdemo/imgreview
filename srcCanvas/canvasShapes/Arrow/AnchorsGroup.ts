import Konva from 'konva';
import _ from 'lodash';
import Anchor, { EAnchorType } from './Anchor';
import { IAnchorsCoordinates, IAnchorsPosition } from './arrowTypes';
import store from '../../store';
import { drawLayers } from '../../model/shapes/shapesActions';
import { ELayerTypes } from '../../model/shapes/shapesModelTypes';
import {
  distanceBetweenTwoPoints,
  getInnerProductSpace,
} from '../../services/number';
import { CallbackMap } from '../../services/CallbackMap';
import { OnEvtKey, TPos } from '../../custom';

class AnchorsGroup {
  static defineAnchors(
    stageSize: { width: number; height: number },
    maxLength: number,
    anchorsPosition?: IAnchorsPosition,
  ) {
    let startX: number;
    let startY: number;
    let controlX: number;
    let controlY: number;
    let endX: number;
    let endY: number;

    if (anchorsPosition) {
      startX = anchorsPosition.start.x;
      startY = anchorsPosition.start.y;
      controlX = anchorsPosition.control.x;
      controlY = anchorsPosition.control.y;
      endX = anchorsPosition.end.x;
      endY = anchorsPosition.end.y;
    } else {
      startX = stageSize.width / 4;
      startY = stageSize.height / 2;

      controlX = stageSize.width / 2;
      controlY = startY;

      endX = startX * 3;
      endY = startY;

      if (Math.abs(endX - startX) > maxLength) {
        startX = controlX - maxLength / 2;
        endX = controlX + maxLength / 2;
      }
    }

    return {
      start: new Anchor(startX, startY, EAnchorType.START),
      control: new Anchor(controlX, controlY, EAnchorType.CONTROL),
      end: new Anchor(endX, endY, EAnchorType.END),
    };
  }

  private _anchors:
    | {
        start: Anchor;
        control: Anchor;
        end: Anchor;
      }
    | undefined;
  private readonly _anchorsPosition: IAnchorsPosition | undefined;
  private readonly _prevAnchorsPosition: IAnchorsPosition;
  private readonly _cbMap: CallbackMap<OnEvtKey> = new CallbackMap<OnEvtKey>();

  constructor(anchorsPosition?: IAnchorsPosition) {
    this._anchorsPosition = anchorsPosition;
    this._prevAnchorsPosition = {
      start: { x: 0, y: 0 },
      control: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      angles: {
        start: _.get(anchorsPosition, 'angles.start', 0),
        control: _.get(anchorsPosition, 'angles.control', 0),
        end: _.get(anchorsPosition, 'angles.end', Math.PI),
      },
    };
  }

  // This method is used to change `control` anchor position after rotating `start` or `end`
  private calculateRotatedControlPos(
    angleChange: number,
    centerPos: TPos,
  ): TPos {
    if (!this._anchors) {
      throw new Error('`this.anchors` is not defined');
    }
    const controlPos = this._anchors.control.getPosition();

    // control position in new coordinate system
    const currentControlPos = {
      x: controlPos.x - centerPos.x,
      y: controlPos.y - centerPos.y,
    };
    const cosAngle = Math.cos(angleChange);
    const sinAngle = Math.sin(angleChange);
    const nextControlPos = {
      x: currentControlPos.x * cosAngle - currentControlPos.y * sinAngle,
      y: currentControlPos.y * cosAngle + currentControlPos.x * sinAngle,
    };
    return {
      x: nextControlPos.x + centerPos.x,
      y: nextControlPos.y + centerPos.y,
    };
  }

  private calculateMovedControlPos(
    controlPos: TPos,
    centerAnchor: 'start' | 'end',
  ): TPos {
    if (!this._anchors) {
      throw new Error('`this.anchors` is not defined');
    }

    // line between anchors: `start` and `end`
    const preLineSE = distanceBetweenTwoPoints(
      this._prevAnchorsPosition.start,
      this._prevAnchorsPosition.end,
    );
    const startPos = this._anchors.start.getPosition();
    const endPos = this._anchors.end.getPosition();
    const lineSE = distanceBetweenTwoPoints(startPos, endPos);
    const lineDiffSE = lineSE / preLineSE;

    // line between anchors: `control` and (`end` || `start`)
    const centerAnchorPos = centerAnchor === 'start' ? startPos : endPos;
    const lineNorm = distanceBetweenTwoPoints(controlPos, centerAnchorPos);

    const dirX = (centerAnchorPos.x - controlPos.x) / lineNorm;
    const dirY = (centerAnchorPos.y - controlPos.y) / lineNorm;

    const lineDiff = lineNorm - lineNorm * lineDiffSE;

    return {
      x: controlPos.x + lineDiff * dirX,
      y: controlPos.y + lineDiff * dirY,
    };
  }

  private moveStart = () => {
    if (!this._anchors) {
      throw new Error('`this.anchors` is not defined');
    }
    const startPos = this._anchors.start.getPosition();
    const endPos = this._anchors.end.getPosition();
    const startAngle = getInnerProductSpace(startPos, endPos);
    const angleChange = startAngle - this._prevAnchorsPosition.angles.start;

    const newControlPos = this.calculateMovedControlPos(
      this.calculateRotatedControlPos(angleChange, endPos),
      'end',
    );

    this._anchors.control.setPosition(newControlPos.x, newControlPos.y);
    this.moveControl();

    this._prevAnchorsPosition.start = startPos;
    this._prevAnchorsPosition.control = newControlPos;
    this._prevAnchorsPosition.end = endPos;
    this._prevAnchorsPosition.angles.start = startAngle;
    this._prevAnchorsPosition.angles.end = Math.PI + startAngle;
  };

  private moveControl = () => {
    this._cbMap.call('dragmove');
  };

  private moveEnd = () => {
    if (!this._anchors) {
      throw new Error('`this.anchors` is not defined');
    }
    const startPos = this._anchors.start.getPosition();
    const endPos = this._anchors.end.getPosition();
    const endAngle = getInnerProductSpace(endPos, startPos);
    const angleChange = endAngle - this._prevAnchorsPosition.angles.end;

    const newControlPos = this.calculateMovedControlPos(
      this.calculateRotatedControlPos(angleChange, startPos),
      'start',
    );

    this._anchors.control.setPosition(newControlPos.x, newControlPos.y);
    this.moveControl();

    this._prevAnchorsPosition.start = startPos;
    this._prevAnchorsPosition.control = newControlPos;
    this._prevAnchorsPosition.end = endPos;
    this._prevAnchorsPosition.angles.start = Math.PI + endAngle;
    this._prevAnchorsPosition.angles.end = endAngle;
  };

  private onDragEnd = () => {
    this._cbMap.call('dragend');
  };

  visible = (isVisible: boolean) => {
    this._anchors?.start.visible(isVisible);
    this._anchors?.control.visible(isVisible);
    this._anchors?.end.visible(isVisible);
  };

  draw() {
    this._anchors?.start.draw();
    this._anchors?.control.draw();
    this._anchors?.end.draw();
    store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
  }

  /**
   * Setting anchors is a different method since I want to separate it from adding to stage.
   * It's important for arrow, since I need defined anchors in order to create ArrowHead,
   * but I want to add anchors only after adding the head.
   */
  setAnchors(stageSize: { width: number; height: number }, maxLength: number) {
    this._anchors = AnchorsGroup.defineAnchors(
      stageSize,
      maxLength,
      this._anchorsPosition,
    );
    this._prevAnchorsPosition.start = this._anchors.start.getPosition();
    this._prevAnchorsPosition.control = this._anchors.control.getPosition();
    this._prevAnchorsPosition.end = this._anchors.end.getPosition();

    this._anchors.start.on('dragmove', this.moveStart);
    this._anchors.control.on('dragmove', this.moveControl);
    this._anchors.end.on('dragmove', this.moveEnd);

    this._anchors.start.on('dragend', this.onDragEnd);
    this._anchors.control.on('dragend', this.onDragEnd);
    this._anchors.end.on('dragend', this.onDragEnd);
  }

  addToLayer(layer: Konva.Layer) {
    if (!this._anchors) {
      throw new Error('`this.anchors` is not defined');
    }
    layer.add(this._anchors.start.getAnchor());
    layer.add(this._anchors.control.getAnchor());
    layer.add(this._anchors.end.getAnchor());
  }

  getPositions(): IAnchorsPosition {
    // While cloning this.anchors wouldn't be available,
    // since setAnchors() will be called while adding to stage.
    // Therefore I'm returning this.anchorsPosition that is passed in constructor.
    if (!this._anchors && this._anchorsPosition) {
      return this._anchorsPosition;
    }
    return {
      start: this._anchors!.start.getPosition(),
      control: this._anchors!.control.getPosition(),
      end: this._anchors!.end.getPosition(),
      angles: this._prevAnchorsPosition?.angles,
    };
  }

  setAnchorsCoordinates(anchorsCoordinates: IAnchorsCoordinates) {
    this._prevAnchorsPosition.start = anchorsCoordinates.start;
    this._prevAnchorsPosition.control = anchorsCoordinates.control;
    this._prevAnchorsPosition.end = anchorsCoordinates.end;
    this._anchors?.start.setPosition(
      anchorsCoordinates.start.x,
      anchorsCoordinates.start.y,
    );
    this._anchors?.control.setPosition(
      anchorsCoordinates.control.x,
      anchorsCoordinates.control.y,
    );
    this._anchors?.end.setPosition(
      anchorsCoordinates.end.x,
      anchorsCoordinates.end.y,
    );

    // In case when this method is used to free transform of the Arrow (like in Arrow.initDraw)
    // I need also to set angles.
    const startAngle = getInnerProductSpace(
      anchorsCoordinates.start,
      anchorsCoordinates.end,
    );
    this._prevAnchorsPosition.angles.start = startAngle;
    this._prevAnchorsPosition.angles.end = Math.PI + startAngle;
  }

  /**
   * See explanation of what `delta` is in Anchor.ts
   */
  setDelta(x: number, y: number) {
    this._anchors?.start.setDelta(x, y);
    this._anchors?.control.setDelta(x, y);
    this._anchors?.end.setDelta(x, y);
  }

  /**
   * Set `on` callback for the arrow (path and head)
   * @param key {string}
   * @param cb {function}
   */
  on = (key: OnEvtKey, cb: () => void) => {
    this._cbMap.set(key, cb);
  };

  /**
   * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    this._anchors?.start?.destroy();
    this._anchors?.control?.destroy();
    this._anchors?.end?.destroy();
  }
}

export default AnchorsGroup;
