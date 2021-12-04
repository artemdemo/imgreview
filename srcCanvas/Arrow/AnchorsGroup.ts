import Konva, { TPos } from 'konva';
import _ from 'lodash';
import Anchor, { EAnchorType } from './Anchor';
import { IAnchorsCoordinates, IAnchorsPosition } from './arrowTypes';
import store from '../store';
import { drawLayers } from '../model/shapes/shapesActions';
import { ELayerTypes } from '../model/shapes/shapesModelTypes';
import {
  distanceBetweenTwoPoints,
  getInnerProductSpace,
} from '../services/number';

class AnchorsGroup {
  static defineAnchors(
    stageSize: { width: number; height: number },
    maxLength: number,
    anchorsPosition?: IAnchorsPosition
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

  #anchors: {
    start: Anchor;
    control: Anchor;
    end: Anchor;
  };
  readonly #anchorsPosition: IAnchorsPosition | undefined;
  readonly #prevAnchorsPosition: IAnchorsPosition;
  readonly #cbMap: Map<string, (e?: any) => void>;

  constructor(anchorsPosition?: IAnchorsPosition) {
    this.#anchorsPosition = anchorsPosition;
    this.#prevAnchorsPosition = {
      start: { x: 0, y: 0 },
      control: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      angles: {
        start: _.get(anchorsPosition, 'angles.start', 0),
        control: _.get(anchorsPosition, 'angles.control', 0),
        end: _.get(anchorsPosition, 'angles.end', Math.PI),
      },
    };

    this.#cbMap = new Map();
  }

  // This method is used to change `control` anchor position after rotating `start` or `end`
  private calculateRotatedControlPos(
    angleChange: number,
    centerPos: TPos
  ): TPos {
    const controlPos = this.#anchors.control.getPosition();

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
    centerAnchor: 'start' | 'end'
  ): TPos {
    // line between anchors: `start` and `end`
    const preLineSE = distanceBetweenTwoPoints(
      this.#prevAnchorsPosition.start,
      this.#prevAnchorsPosition.end
    );
    const startPos = this.#anchors.start.getPosition();
    const endPos = this.#anchors.end.getPosition();
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
    const startPos = this.#anchors.start.getPosition();
    const endPos = this.#anchors.end.getPosition();
    const startAngle = getInnerProductSpace(startPos, endPos);
    const angleChange = startAngle - this.#prevAnchorsPosition.angles.start;

    const newControlPos = this.calculateMovedControlPos(
      this.calculateRotatedControlPos(angleChange, endPos),
      'end'
    );

    this.#anchors.control.setPosition(newControlPos.x, newControlPos.y);
    this.moveControl();

    this.#prevAnchorsPosition.start = startPos;
    this.#prevAnchorsPosition.control = newControlPos;
    this.#prevAnchorsPosition.end = endPos;
    this.#prevAnchorsPosition.angles.start = startAngle;
    this.#prevAnchorsPosition.angles.end = Math.PI + startAngle;
  };

  private moveControl = () => {
    const dragmoveCb = this.#cbMap.get('dragmove');
    dragmoveCb && dragmoveCb();
  };

  private moveEnd = () => {
    const startPos = this.#anchors.start.getPosition();
    const endPos = this.#anchors.end.getPosition();
    const endAngle = getInnerProductSpace(endPos, startPos);
    const angleChange = endAngle - this.#prevAnchorsPosition.angles.end;

    const newControlPos = this.calculateMovedControlPos(
      this.calculateRotatedControlPos(angleChange, startPos),
      'start'
    );

    this.#anchors.control.setPosition(newControlPos.x, newControlPos.y);
    this.moveControl();

    this.#prevAnchorsPosition.start = startPos;
    this.#prevAnchorsPosition.control = newControlPos;
    this.#prevAnchorsPosition.end = endPos;
    this.#prevAnchorsPosition.angles.start = Math.PI + endAngle;
    this.#prevAnchorsPosition.angles.end = endAngle;
  };

  private onDragEnd = () => {
    const dragendCb = this.#cbMap.get('dragend');
    dragendCb && dragendCb();
  };

  visible = (isVisible: boolean) => {
    this.#anchors.start.visible(isVisible);
    this.#anchors.control.visible(isVisible);
    this.#anchors.end.visible(isVisible);
  };

  draw() {
    this.#anchors.start.draw();
    this.#anchors.control.draw();
    this.#anchors.end.draw();
    store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
  }

  /**
   * Setting anchors is a different method since I want to separate it from adding to stage.
   * It's important for arrow, since I need defined anchors in order to create ArrowHead,
   * but I want to add anchors only after adding the head.
   */
  setAnchors(stageSize, maxLength) {
    this.#anchors = AnchorsGroup.defineAnchors(
      stageSize,
      maxLength,
      this.#anchorsPosition
    );
    this.#prevAnchorsPosition.start = this.#anchors.start.getPosition();
    this.#prevAnchorsPosition.control = this.#anchors.control.getPosition();
    this.#prevAnchorsPosition.end = this.#anchors.end.getPosition();

    this.#anchors.start.on('dragmove', this.moveStart);
    this.#anchors.control.on('dragmove', this.moveControl);
    this.#anchors.end.on('dragmove', this.moveEnd);

    this.#anchors.start.on('dragend', this.onDragEnd);
    this.#anchors.control.on('dragend', this.onDragEnd);
    this.#anchors.end.on('dragend', this.onDragEnd);
  }

  addToLayer(layer: Konva.Layer) {
    layer.add(this.#anchors.start.getAnchor());
    layer.add(this.#anchors.control.getAnchor());
    layer.add(this.#anchors.end.getAnchor());
  }

  getPositions(): IAnchorsPosition {
    // While cloning this.#anchors wouldn't be available,
    // since setAnchors() will be called while adding to stage.
    // Therefore I'm returning this.#anchorsPosition that is passed in constructor.
    if (!this.#anchors && this.#anchorsPosition) {
      return this.#anchorsPosition;
    }
    return {
      start: this.#anchors.start.getPosition(),
      control: this.#anchors.control.getPosition(),
      end: this.#anchors.end.getPosition(),
      angles: this.#prevAnchorsPosition?.angles,
    };
  }

  setAnchorsCoordinates(anchorsCoordinates: IAnchorsCoordinates) {
    this.#prevAnchorsPosition.start = anchorsCoordinates.start;
    this.#prevAnchorsPosition.control = anchorsCoordinates.control;
    this.#prevAnchorsPosition.end = anchorsCoordinates.end;
    this.#anchors.start.setPosition(
      anchorsCoordinates.start.x,
      anchorsCoordinates.start.y
    );
    this.#anchors.control.setPosition(
      anchorsCoordinates.control.x,
      anchorsCoordinates.control.y
    );
    this.#anchors.end.setPosition(
      anchorsCoordinates.end.x,
      anchorsCoordinates.end.y
    );

    // In case when this method is used to free transform of the Arrow (like in Arrow.initDraw)
    // I need also to set angles.
    const startAngle = getInnerProductSpace(
      anchorsCoordinates.start,
      anchorsCoordinates.end
    );
    this.#prevAnchorsPosition.angles.start = startAngle;
    this.#prevAnchorsPosition.angles.end = Math.PI + startAngle;
  }

  /**
   * See explanation of what `delta` is in Anchor.ts
   */
  setDelta(x: number, y: number) {
    this.#anchors.start.setDelta(x, y);
    this.#anchors.control.setDelta(x, y);
    this.#anchors.end.setDelta(x, y);
  }

  /**
   * Set `on` callback for the arrow (path and head)
   * @param key {string}
   * @param cb {function}
   */
  on = (key: string, cb: () => void) => {
    this.#cbMap.set(key, cb);
  };

  /**
   * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    this.#anchors?.start?.destroy();
    this.#anchors?.control?.destroy();
    this.#anchors?.end?.destroy();
  }
}

export default AnchorsGroup;
