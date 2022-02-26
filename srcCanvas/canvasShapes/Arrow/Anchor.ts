import Konva from 'konva';
import _ from 'lodash';
import { CallbackMap } from '../../services/CallbackMap';
import { OnEvtKey, TPos } from '../../custom';

const anchorStyles = {
  control: {
    radius: 5,
    stroke: '#855824',
    fill: '#dddd45',
    strokeWidth: 1,
  },
  default: {
    radius: 6,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 1,
  },
};

export enum EAnchorType {
  START = 'start',
  CONTROL = 'control',
  END = 'end',
}

class Anchor {
  private readonly _anchor: Konva.Circle;
  private readonly _cbMap: CallbackMap<OnEvtKey> = new CallbackMap<OnEvtKey>();
  private readonly _delta: TPos;
  private readonly _appliedDelta: TPos;
  private readonly _originalPosition: TPos;

  constructor(x: number, y: number, type: EAnchorType) {
    let params = {
      ...{
        x,
        y,
        draggable: true,
        visible: false,
      },
      ...anchorStyles.default,
    };

    if (type === EAnchorType.CONTROL) {
      params = {
        ...params,
        ...anchorStyles.control,
      };
    }

    this._anchor = new Konva.Circle(params);

    this._originalPosition = {
      x,
      y,
    };

    // See explanation in `this.setDelta()`
    this._delta = { x: 0, y: 0 };
    this._appliedDelta = { x: 0, y: 0 };

    this.initEvents();
  }

  /**
   * Set callback
   */
  on = (key: OnEvtKey, cb: (...rest: any) => void) => {
    this._cbMap.set(key, cb);
  };

  private initEvents() {
    this._anchor.on('mouseover', this._cbMap.get('mouseover'));

    this._anchor.on('mouseout', this._cbMap.get('mouseout'));

    this._anchor.on('mousedown', this._cbMap.get('mousedown'));

    this._anchor.on('mouseup', this._cbMap.get('mouseup'));

    this._anchor.on('dragend', () => {
      this._cbMap.call('dragend');
      const oPosition = this.getPosition();
      this._originalPosition.x = oPosition.x;
      this._originalPosition.y = oPosition.y;

      // See explanation in `this.setDelta()`
      this._appliedDelta.x = this._delta.x;
      this._appliedDelta.y = this._delta.y;
    });

    this._anchor.on(
      'dragmove',
      _.throttle((...args) => {
        this._cbMap.call('dragmove', ...args);
      }, 50),
    );
  }

  getAnchor() {
    return this._anchor;
  }

  setPosition(x: number, y: number) {
    this._anchor.setAttr('x', x);
    this._anchor.setAttr('y', y);
    this._originalPosition.x = x;
    this._originalPosition.y = y;
    this._appliedDelta.x = this._delta.x;
    this._appliedDelta.y = this._delta.y;
  }

  getPosition(): TPos {
    const { x, y } = this._anchor.getAttrs();
    return {
      x,
      y,
    };
  }

  draw() {
    this._anchor.draw();
  }

  setDelta(deltaX = 0, deltaY = 0) {
    // Let's say arrow (as whole object) has been moved, I changed anchor position, based on move delta
    // But if after that I move anchor I will face the problem next time I will move the path
    // Anchor coordinates will be relative to previous delta.
    // Delta is always relative to the original coordinates of the arrow
    // Then if I will just change it - I will apply it twice.
    // Solution in this case will be - save appliedDelta and reduce it next time
    this._anchor.setAttr(
      'x',
      this._originalPosition.x + (deltaX - this._appliedDelta.x),
    );
    this._anchor.setAttr(
      'y',
      this._originalPosition.y + (deltaY - this._appliedDelta.y),
    );
    this._delta.x = deltaX;
    this._delta.y = deltaY;
  }

  /**
   * setAttr(attr, val)
   * @docs https://konvajs.github.io/api/Konva.Node.html#setAttr
   */
  setAttr(key: string, val: any) {
    this._anchor.setAttr(key, val);
  }

  visible(visibleStatus: boolean) {
    this._anchor.visible(visibleStatus);
  }

  /**
   * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    this._anchor.destroy();
  }
}

export default Anchor;
