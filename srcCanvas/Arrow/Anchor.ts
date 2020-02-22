import Konva from 'konva';
import _throttle from 'lodash/throttle';
import { TCoordinate } from './arrowTypes';

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
    readonly #anchor: any;
    readonly #cbMap: any;

    delta: TCoordinate;
    originalPosition: TCoordinate;
    appliedDelta: TCoordinate;

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

        this.originalPosition = {
            x,
            y,
        };

        // See explanation in `this.setDelta()`
        this.delta = {x: 0, y: 0};
        this.appliedDelta = {x: 0, y: 0};

        this.#cbMap = new Map();

        this.initEvents();
    }

    /**
     * Set callback
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this.#cbMap.set(key, cb);
    };

    private initEvents() {
        this.#anchor.on('mouseover', (...args) => {
            if (this.#cbMap.has('mouseover')) {
                this.#cbMap.get('mouseover')(args);
            }
        });

        this.#anchor.on('mouseout', (...args) => {
            if (this.#cbMap.has('mouseout')) {
                this.#cbMap.get('mouseout')(args);
            }
        });

        this.#anchor.on('mousedown', (...args) => {
            if (this.#cbMap.has('mousedown')) {
                this.#cbMap.get('mousedown')(args);
            }
        });

        this.#anchor.on('mouseup', (...args) => {
            if (this.#cbMap.has('mouseup')) {
                this.#cbMap.get('mouseup')(args);
            }
        });

        this.#anchor.on('dragend', (...args) => {
            if (this.#cbMap.has('dragend')) {
                this.#cbMap.get('dragend')(args);
            }
            this.originalPosition = this.getPosition();

            // See explanation in `this.setDelta()`
            this.appliedDelta = {x: this.delta.x, y: this.delta.y};
        });

        this.#anchor.on('dragmove', _throttle((...args) => {
            if (this.#cbMap.has('dragmove')) {
                this.#cbMap.get('dragmove')(args);
            }
        }, 50));
    }

    getAnchor() {
        return this.#anchor;
    }

    setPosition(x, y) {
        this.#anchor.setAttr('x', x);
        this.#anchor.setAttr('y', y);
        this.originalPosition = { x, y };
        this.appliedDelta = {x: this.delta.x, y: this.delta.y};
    }

    getPosition(): TCoordinate {
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
        this.#anchor.setAttr('x', this.originalPosition.x + (deltaX - this.appliedDelta.x));
        this.#anchor.setAttr('y', this.originalPosition.y + (deltaY - this.appliedDelta.y));
        this.delta = {x: deltaX, y: deltaY};
    }

    /**
     * setAttr(attr, val)
     * @docs https://konvajs.github.io/api/Konva.Node.html#setAttr
     * @param rest
     */
    setAttr(...rest) {
        this.#anchor.setAttr(...rest);
    }

    visible(visibleStatus) {
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
