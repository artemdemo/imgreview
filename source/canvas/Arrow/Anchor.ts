import Konva from 'konva';
import _throttle from 'lodash/throttle';

const anchorStyles = {
    control: {
        radius: 5,
        stroke: '#6c5e18',
        fill: '#ddc62d',
        strokeWidth: 1,
    },
    default: {
        radius: 7,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 1,
    },
};

type TCoordinate = {
    x: number,
    y: number,
}

class Anchor {
    private readonly _anchor: any;
    private _cbMap: any;

    originalPosition: TCoordinate;
    delta: TCoordinate;
    appliedDelta: TCoordinate;
    type: any;

    constructor(x, y, type) {
        const params = {
            ...{
                x,
                y,
                draggable: true,
                visible: false,
            },
            ...anchorStyles.default,
        };

        this._anchor = new Konva.Circle(params);

        this.originalPosition = {
            x,
            y,
        };

        // See explanation in `this.setDelta()`
        this.delta = {x: 0, y: 0};
        this.appliedDelta = {x: 0, y: 0};

        this.type = type;

        this._cbMap = new Map();

        this.initEvents();
    }

    /**
     * Set callback
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this._cbMap.set(key, cb);
    };

    private initEvents() {
        this._anchor.on('mouseover', (...args) => {
            if (this._cbMap.has('mouseover')) {
                this._cbMap.get('mouseover')(args);
            }
        });

        this._anchor.on('mouseout', (...args) => {
            if (this._cbMap.has('mouseout')) {
                this._cbMap.get('mouseout')(args);
            }
        });

        this._anchor.on('mousedown', (...args) => {
            if (this._cbMap.has('mousedown')) {
                this._cbMap.get('mousedown')(args);
            }
        });

        this._anchor.on('mouseup', (...args) => {
            if (this._cbMap.has('mouseup')) {
                this._cbMap.get('mouseup')(args);
            }
        });

        this._anchor.on('dragend', (...args) => {
            if (this._cbMap.has('dragend')) {
                this._cbMap.get('dragend')(args);
            }
            this.originalPosition = this.getPosition();

            // See explanation in `this.setDelta()`
            this.appliedDelta = {x: this.delta.x, y: this.delta.y};
        });

        this._anchor.on('dragmove', _throttle((...args) => {
            if (this._cbMap.has('dragmove')) {
                this._cbMap.get('dragmove')(args);
            }
        }, 50));
    }

    getAnchor() {
        return this._anchor;
    }

    setPosition(x, y) {
        this._anchor.setAttr('x', x);
        this._anchor.setAttr('y', y);
        this.originalPosition = { x, y };
        this.appliedDelta = {x: this.delta.x, y: this.delta.y};
    }

    getPosition() {
        return {
            x: this._anchor.attrs.x,
            y: this._anchor.attrs.y,
        };
    }

    draw() {
        this._anchor.draw();
    }

    setDelta(deltaX = 0, deltaY = 0) {
        // Let's say arrow (as whole object) has been moved, I changed anchor position, based on move delta
        // But if after that I move anchor I will face the problem next time I will move the path
        // Anchor coordinates will be relative to previous delta
        // Delta is always relative to the original coordinates of the arrow
        // Then if I will just change it - I will apply it twice.
        // Solution in this case will be - save appliedDelta and reduce it next time
        this._anchor.setAttr('x', this.originalPosition.x + (deltaX - this.appliedDelta.x));
        this._anchor.setAttr('y', this.originalPosition.y + (deltaY - this.appliedDelta.y));
        this.delta = {x: deltaX, y: deltaY};
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

    /**
     * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
     */
    destroy() {
        this._anchor.destroy();
    }
}

export default Anchor;
