import Konva, {TPos} from "konva";
import _throttle from "lodash/throttle";

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
    readonly #cbMap: Map<string, (e: any) => void>;
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
        this.#delta = {x: 0, y: 0};
        this.#appliedDelta = {x: 0, y: 0};

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
            const mouseoverCb = this.#cbMap.get('mouseover');
            mouseoverCb && mouseoverCb(args);
        });

        this.#anchor.on('mouseout', (...args) => {
            const mouseoutCb = this.#cbMap.get('mouseout');
            mouseoutCb && mouseoutCb(args);
        });

        this.#anchor.on('mousedown', (...args) => {
            const mousedownCb = this.#cbMap.get('mousedown');
            mousedownCb && mousedownCb(args);
        });

        this.#anchor.on('mouseup', (...args) => {
            const mouseupCb = this.#cbMap.get('mouseup');
            mouseupCb && mouseupCb(args);
        });

        this.#anchor.on('dragend', (...args) => {
            const dragendCb = this.#cbMap.get('dragend');
            dragendCb && dragendCb(args);
            const oPosition = this.getPosition();
            this.#originalPosition.x = oPosition.x;
            this.#originalPosition.y = oPosition.y;

            // See explanation in `this.setDelta()`
            this.#appliedDelta.x = this.#delta.x;
            this.#appliedDelta.y = this.#delta.y;
        });

        this.#anchor.on('dragmove', _throttle((...args) => {
            const dragmoveCb = this.#cbMap.get('dragmove');
            dragmoveCb && dragmoveCb(args);
        }, 50));
    }

    getAnchor() {
        return this.#anchor;
    }

    setPosition(x, y) {
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
        this.#anchor.setAttr('x', this.#originalPosition.x + (deltaX - this.#appliedDelta.x));
        this.#anchor.setAttr('y', this.#originalPosition.y + (deltaY - this.#appliedDelta.y));
        this.#delta.x = deltaX;
        this.#delta.y = deltaY;
    }

    /**
     * setAttr(attr, val)
     * @docs https://konvajs.github.io/api/Konva.Node.html#setAttr
     * @param key {string}
     * @param val {*}
     */
    setAttr(key: string, val: any) {
        this.#anchor.setAttr(key, val);
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
