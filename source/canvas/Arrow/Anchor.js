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

        this._anchor.on('dragend', (...args) => this._dragEndCb && this._dragEndCb(...args));

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

    visible(visibleStatus) {
        this._anchor.visible(visibleStatus);
    }
}

export default Anchor;
