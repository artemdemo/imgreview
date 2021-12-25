import Konva, { TPos } from 'konva';
import _ from 'lodash';
import { CallbackMap } from '../../services/CallbackMap';

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
  readonly #anchor: Konva.Circle;
  readonly #cbMap: CallbackMap = new CallbackMap();
  readonly #delta: TPos;
  readonly #appliedDelta: TPos;
  readonly #originalPosition: TPos;

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

    this.#anchor = new Konva.Circle(params);

    this.#originalPosition = {
      x,
      y,
    };

    // See explanation in `this.setDelta()`
    this.#delta = { x: 0, y: 0 };
    this.#appliedDelta = { x: 0, y: 0 };

    this.initEvents();
  }

  /**
   * Set callback
   */
  on = (key: string, cb: (...rest: any) => void) => {
    this.#cbMap.set(key, cb);
  };

  private initEvents() {
    this.#anchor.on('mouseover', this.#cbMap.get('mouseover'));

    this.#anchor.on('mouseout', this.#cbMap.get('mouseout'));

    this.#anchor.on('mousedown', this.#cbMap.get('mousedown'));

    this.#anchor.on('mouseup', this.#cbMap.get('mouseup'));

    this.#anchor.on('dragend', () => {
      this.#cbMap.call('dragend');
      const oPosition = this.getPosition();
      this.#originalPosition.x = oPosition.x;
      this.#originalPosition.y = oPosition.y;

      // See explanation in `this.setDelta()`
      this.#appliedDelta.x = this.#delta.x;
      this.#appliedDelta.y = this.#delta.y;
    });

    this.#anchor.on(
      'dragmove',
      _.throttle((...args) => {
        this.#cbMap.call('dragmove', ...args);
      }, 50)
    );
  }

  getAnchor() {
    return this.#anchor;
  }

  setPosition(x: number, y: number) {
    this.#anchor.setAttr('x', x);
    this.#anchor.setAttr('y', y);
    this.#originalPosition.x = x;
    this.#originalPosition.y = y;
    this.#appliedDelta.x = this.#delta.x;
    this.#appliedDelta.y = this.#delta.y;
  }

  getPosition(): TPos {
    const { x, y } = this.#anchor.getAttrs();
    return {
      x,
      y,
    };
  }

  draw() {
    this.#anchor.draw();
  }

  setDelta(deltaX = 0, deltaY = 0) {
    // Let's say arrow (as whole object) has been moved, I changed anchor position, based on move delta
    // But if after that I move anchor I will face the problem next time I will move the path
    // Anchor coordinates will be relative to previous delta
    // Delta is always relative to the original coordinates of the arrow
    // Then if I will just change it - I will apply it twice.
    // Solution in this case will be - save appliedDelta and reduce it next time
    this.#anchor.setAttr(
      'x',
      this.#originalPosition.x + (deltaX - this.#appliedDelta.x)
    );
    this.#anchor.setAttr(
      'y',
      this.#originalPosition.y + (deltaY - this.#appliedDelta.y)
    );
    this.#delta.x = deltaX;
    this.#delta.y = deltaY;
  }

  /**
   * setAttr(attr, val)
   * @docs https://konvajs.github.io/api/Konva.Node.html#setAttr
   */
  setAttr(key: string, val: any) {
    this.#anchor.setAttr(key, val);
  }

  visible(visibleStatus: boolean) {
    this.#anchor.visible(visibleStatus);
  }

  /**
   * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    this.#anchor.destroy();
  }
}

export default Anchor;
