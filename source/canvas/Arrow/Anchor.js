import Konva from 'konva';
import _throttle from 'lodash/throttle';

class Anchor {
    constructor(x, y) {
        this._anchor = new Konva.Circle({
            x,
            y,
            radius: 10,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 1,
            draggable: true,
            visible: false,
        });

        this._dragEndCb = null;
        this._dragMoveCb = null;
        this._mouseOverCb = null;
        this._mouseOutCb = null;

        this.originalPosition = {
            x,
            y,
        };

        // See explanation in `this.setDelta()`
        this.delta = {x: 0, y: 0};
        this.appliedDelta = {x: 0, y: 0};

        this.initEvents();
    }

    setDragEndCb(cb) {
        this._dragEndCb = cb;
    }

    setDragMoveCb(cb) {
        this._onDragMoveCb = cb;
    }

    setMouseOverCb(cb) {
        this._mouseOverCb = cb;
    }

    setMouseOutCb(cb) {
        this._mouseOutCb = cb;
    }

    initEvents() {
        this._anchor.on('mouseover', () => {
            document.body.style.cursor = 'pointer';
            this._anchor.setStrokeWidth(4);
            this._mouseOverCb && this._mouseOverCb();
        });

        this._anchor.on('mouseout', () => {
            document.body.style.cursor = 'default';
            this._anchor.setStrokeWidth(1);
            this._mouseOutCb && this._mouseOutCb();
        });

        this._anchor.on('dragend', (...args) => {
            this._dragEndCb && this._dragEndCb(...args);
            this.originalPosition = this.getPosition();

            // See explanation in `this.setDelta()`
            this.appliedDelta.x = this.delta.x;
            this.appliedDelta.y = this.delta.y;
        });

        this._anchor.on('dragmove', _throttle((...args) => this._onDragMoveCb && this._onDragMoveCb(...args), 50));
    }

    getAnchor() {
        return this._anchor;
    }

    getPosition() {
        return {
            x: this._anchor.attrs.x,
            y: this._anchor.attrs.y,
        };
    }

    setDelta(deltaX = 0, deltaY = 0) {
        // Let's say arrow has been moved, I changed anchor position, based on move delta
        // But if after that I move anchor I will face the problem next time I will move the path
        // Anchor coordinates will be relative to previous delta
        // Delta is always relative to the original coordinates of the arrow
        // Then if I will just change it - I will apply it twice.
        // Solution in this case will be - save appliedDelta and reduce it next time
        this._anchor.setAttr('x', this.originalPosition.x + (deltaX - this.appliedDelta.x));
        this._anchor.setAttr('y', this.originalPosition.y + (deltaY - this.appliedDelta.y));
        this.delta.x = deltaX;
        this.delta.y = deltaY;
    }

    /**
     * setAttr(attr, val)
     * @docs https://konvajs.github.io/api/Konva.Node.html#setAttr
     * @param rest
     */
    setAttr(...rest) {
        this._anchor.setAttr(...rest);
    }

    visible(visibleStatus) {
        this._anchor.visible(visibleStatus);
    }
}

export default Anchor;
