import Konva from "konva/konva";
import { TCoordinate } from "./arrowTypes";

const degToRad = (deg: number): number => {
    return deg * (Math.PI / 180);
};

const MAX_HEAD_LEN = 14;
const MIN_HEAD_ANGLE = 20;
const MAX_HEAD_ANGLE = 50;

class ArrowHead {
    // Trigonometry calculation of 3 points of the arrow head
    // See `ArrowHead-schema.jpg` for variables definition
    //
    static calculateHeadPoints(startAnchorPos: TCoordinate, controlAnchorPos: TCoordinate, strokeWidth: number) {
        const rightArmCoor: TCoordinate = {x: 0, y: 0};
        const leftArmCoor: TCoordinate = {x: 0, y: 0};

        let anchorAngle: number;
        const anchorXdiff = startAnchorPos.x - controlAnchorPos.x;
        const anchorYdiff = startAnchorPos.y - controlAnchorPos.y;

        if (anchorXdiff === 0) {
            anchorAngle = degToRad(90);
        } else {
            anchorAngle = Math.atan(anchorYdiff / anchorXdiff);
            if (anchorXdiff > 0) {
                anchorAngle += degToRad(180);
            }
        }

        const headAngle = strokeWidth * 10;
        const headAngleRad = degToRad(Math.min(MAX_HEAD_ANGLE, headAngle < MIN_HEAD_ANGLE ? MIN_HEAD_ANGLE : headAngle));

        const headLenResult = Math.min(MAX_HEAD_LEN, strokeWidth * 4.5);

        const rightArmAngle = headAngleRad - anchorAngle;
        rightArmCoor.x = startAnchorPos.x + (headLenResult * Math.cos(rightArmAngle));
        rightArmCoor.y = startAnchorPos.y - (headLenResult * Math.sin(rightArmAngle));

        const leftArmAngle = degToRad(90) - (anchorAngle + headAngleRad);
        leftArmCoor.x = startAnchorPos.x + (headLenResult * Math.sin(leftArmAngle));
        leftArmCoor.y = startAnchorPos.y + (headLenResult * Math.cos(leftArmAngle));

        return [
            leftArmCoor.x,
            leftArmCoor.y,
            startAnchorPos.x,
            startAnchorPos.y,
            rightArmCoor.x,
            rightArmCoor.y,
        ];
    }

    readonly #arrowHead: Konva.Line;
    readonly #cbMap: Map<string, (e: any) => void>;
    readonly #delta: TCoordinate;
    readonly #appliedDelta: TCoordinate;

    constructor(props) {
        this.#arrowHead = new Konva.Line({
            lineCap: 'round',
            lineJoin: 'round',
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            points: ArrowHead.calculateHeadPoints(props.start, props.control, props.strokeWidth),
        });

        this.#cbMap = new Map();

        this.#arrowHead.on('click', (e) => {
            const clickCb = this.#cbMap.get('click');
            if (clickCb) {
                clickCb(e);
            }
        });
        this.#arrowHead.on('mouseover', (e) => {
            const mouseoverCb = this.#cbMap.get('mouseover');
            if (mouseoverCb) {
                mouseoverCb(e);
            }
        });
        this.#arrowHead.on('mouseout', (e) => {
            const mouseoutCb = this.#cbMap.get('mouseout');
            if (mouseoutCb) {
                mouseoutCb(e);
            }
        });

        this.#delta = {x: 0, y: 0};
        this.#appliedDelta = {x: 0, y: 0};
    }

    /**
     * Set callback
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this.#cbMap.set(key, cb);
    };

    /**
     * @public
     */
    update(startAnchorPos, controlAnchorPos, strokeWidth) {
        this.#arrowHead.setPoints(
            ArrowHead.calculateHeadPoints(
                startAnchorPos,
                controlAnchorPos,
                strokeWidth,
            ),
        );
        this.#arrowHead.setAttr('x', 0);
        this.#arrowHead.setAttr('y', 0);
        this.#arrowHead.setAttr('strokeWidth', strokeWidth);
        this.#arrowHead.draw();

        this.#appliedDelta.x = this.#delta.x;
        this.#appliedDelta.y = this.#delta.y;
    }

    draw() {
        this.#arrowHead.draw();
    }

    setDelta(deltaX = 0, deltaY = 0) {
        this.#arrowHead.setAttr('x', deltaX - this.#appliedDelta.x);
        this.#arrowHead.setAttr('y', deltaY - this.#appliedDelta.y);
        this.#delta.x = deltaX;
        this.#delta.y = deltaY;
    }

    setAttr(name, value) {
        this.#arrowHead.setAttr(name, value);
    }

    /**
     * @public
     */
    addToLayer(layer) {
        layer.add(this.#arrowHead);
    }

    /**
     * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
     */
    destroy() {
        this.#arrowHead.destroy();
    }
}

export default ArrowHead;
