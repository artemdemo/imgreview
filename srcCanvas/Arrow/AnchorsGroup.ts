import Konva from 'konva';
import _get from 'lodash/get';
import Anchor, { EAnchorType } from './Anchor';
import {IAnchorsCoordinates, IAnchorsPosition, TCoordinate} from './arrowTypes';

class AnchorsGroup {
    static defineAnchors(
        stageSize: { width: number, height: number },
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
                startX = controlX - (maxLength / 2);
                endX = controlX + (maxLength / 2);
            }
        }

        return {
            start: new Anchor(startX, startY, EAnchorType.START),
            control: new Anchor(controlX, controlY, EAnchorType.CONTROL),
            end: new Anchor(endX, endY, EAnchorType.END),
        };
    }

    /**
     * Calculating "Inner product space"
     * (see image schema in this directory)
     * @link http://qaru.site/questions/465748/inner-angle-between-two-lines/2019402#2019402
     * @link https://en.wikipedia.org/wiki/Inner_product_space
     * @param newPos {object}
     * @param newPos.x {number}
     * @param newPos.y {number}
     * @param centerPos {object} center of the rotation
     * @param centerPos.x {number}
     * @param centerPos.y {number}
     * @return {number} in radians
     */
    static getAngle(newPos: TCoordinate, centerPos: TCoordinate) {
        const deltaXA = 0 - centerPos.x;
        const deltaXB = newPos.x - centerPos.x;
        const deltaYA = 0;
        const deltaYB = newPos.y - centerPos.y;
        const lenA = Math.sqrt((deltaXA ** 2) + (deltaYA ** 2));
        const lenB = Math.sqrt((deltaXB ** 2) + (deltaYB ** 2));
        const nominator = (deltaXA * deltaXB) + (deltaYA * deltaYB);
        const denominator = lenA * lenB;
        if (denominator === 0) {
            return 0;
        }
        const angle = Math.acos(nominator / denominator);
        if (newPos.y > centerPos.y) {
            return (2 * Math.PI) - angle;
        }
        return angle;
    }

    #anchors: any;
    readonly #anchorsPosition: IAnchorsPosition | undefined;
    readonly #prevAnchorsPosition: IAnchorsPosition;
    #cbMap: any;


    constructor(anchorsPosition?: IAnchorsPosition) {
        this.#anchorsPosition = anchorsPosition;
        this.#anchors = null;
        this.#prevAnchorsPosition = {
            start: {x: 0, y: 0},
            control: {x: 0, y: 0},
            end: {x: 0, y: 0},
            angles: {
                start: _get(anchorsPosition, 'angles.start', 0),
                control: _get(anchorsPosition, 'angles.control', 0),
                end: _get(anchorsPosition, 'angles.end', Math.PI),
            },
        };

        this.#cbMap = new Map();
    }

    // This method is used to change `control` anchor position after rotating `start` or `end`
    calculateRotatedControlPos(angleChange: number, centerPos: TCoordinate): TCoordinate {
        const controlPos = this.#anchors.control.getPosition();

        // control position in new coordinate system
        const currentControlPos = {
            x: controlPos.x - centerPos.x,
            y: controlPos.y - centerPos.y,
        };
        const cosAngle = Math.cos(angleChange);
        const sinAngle = Math.sin(angleChange);
        const nextControlPos = {
            x: (currentControlPos.x * cosAngle) - (currentControlPos.y * sinAngle),
            y: (currentControlPos.y * cosAngle) + (currentControlPos.x * sinAngle),
        };
        return {
            x: nextControlPos.x + centerPos.x,
            y: nextControlPos.y + centerPos.y,
        };
    }

    calculateMovedControlPos(controlPos: TCoordinate, centerAnchor: 'start'|'end'): TCoordinate {
        // line between anchors: `start` and `end`
        const preLineSE = Math.sqrt(
            (this.#prevAnchorsPosition.start.x - this.#prevAnchorsPosition.end.x)**2 +
            (this.#prevAnchorsPosition.start.y - this.#prevAnchorsPosition.end.y)**2
        );
        const startPos = this.#anchors.start.getPosition();
        const endPos = this.#anchors.end.getPosition();
        const lineSE = Math.sqrt(
            (startPos.x - endPos.x)**2 + (startPos.y - endPos.y)**2
        );
        const lineDiffSE = lineSE / preLineSE;

        // line between anchors: `control` and (`end` || `start`)
        const centerAnchorPos = centerAnchor === 'start' ? startPos : endPos;
        const lineNorm = Math.sqrt(
            (controlPos.x - centerAnchorPos.x)**2 + (controlPos.y - centerAnchorPos.y)**2
        );

        const dirX = (centerAnchorPos.x - controlPos.x) / lineNorm;
        const dirY = (centerAnchorPos.y - controlPos.y) / lineNorm;

        const lineDiff = lineNorm - (lineNorm * lineDiffSE);

        return {
            x: controlPos.x + (lineDiff * dirX),
            y: controlPos.y + (lineDiff * dirY),
        };
    }

    moveStart = () => {
        const startPos = this.#anchors.start.getPosition();
        const endPos = this.#anchors.end.getPosition();
        const startAngle = AnchorsGroup.getAngle(
            startPos,
            endPos,
        );
        const angleChange = startAngle - this.#prevAnchorsPosition.angles.start;

        const newControlPos = this.calculateMovedControlPos(
            this.calculateRotatedControlPos(angleChange, endPos),
            'end',
        );

        this.#anchors.control.setPosition(
            newControlPos.x,
            newControlPos.y,
        );
        this.#cbMap.has('dragmove') && this.#cbMap.get('dragmove')();

        this.#prevAnchorsPosition.start = startPos;
        this.#prevAnchorsPosition.control = newControlPos;
        this.#prevAnchorsPosition.end = endPos;
        this.#prevAnchorsPosition.angles.start = startAngle;
        this.#prevAnchorsPosition.angles.end = Math.PI + startAngle;
    };

    moveControl = () => {
        this.#cbMap.has('dragmove') && this.#cbMap.get('dragmove')();
    };

    moveEnd = () => {
        const startPos = this.#anchors.start.getPosition();
        const endPos = this.#anchors.end.getPosition();
        const endAngle = AnchorsGroup.getAngle(
            endPos,
            startPos,
        );
        const angleChange = endAngle - this.#prevAnchorsPosition.angles.end;

        const newControlPos = this.calculateMovedControlPos(
            this.calculateRotatedControlPos(angleChange, startPos),
            'start',
        );

        this.#anchors.control.setPosition(
            newControlPos.x,
            newControlPos.y,
        );
        this.#cbMap.has('dragmove') && this.#cbMap.get('dragmove')();

        this.#prevAnchorsPosition.start = startPos;
        this.#prevAnchorsPosition.control = newControlPos;
        this.#prevAnchorsPosition.end = endPos;
        this.#prevAnchorsPosition.angles.start = Math.PI + endAngle;
        this.#prevAnchorsPosition.angles.end = endAngle;
    };

    onDragEnd = () => {
        this.#cbMap.has('dragend') && this.#cbMap.get('dragend')();
    };

    /**
     * @public
     * @param isVisible {boolean}
     */
    visible = (isVisible: boolean) => {
        this.#anchors.start.visible(isVisible);
        this.#anchors.control.visible(isVisible);
        this.#anchors.end.visible(isVisible);
        this.draw();
    };

    /**
     * @public
     */
    draw() {
        this.#anchors.start.draw();
        this.#anchors.control.draw();
        this.#anchors.end.draw();
    }

    /**
     * Setting anchors is a different method since I want to separate it from adding to stage.
     * It's important for arrow, since I need defined anchors in order to create ArrowHead,
     * but I want to add anchors only after adding the head.
     * @public
     */
    setAnchors(stageSize, maxLength) {
        this.#anchors = AnchorsGroup.defineAnchors(stageSize, maxLength, this.#anchorsPosition);
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

    /**
     * @public
     */
    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchors.start.getAnchor());
        layer.add(this.#anchors.control.getAnchor());
        layer.add(this.#anchors.end.getAnchor());
    }

    /**
     * @public
     */
    getPositions(): IAnchorsPosition {
        return {
            start: this.#anchors.start.getPosition(),
            control: this.#anchors.control.getPosition(),
            end: this.#anchors.end.getPosition(),
            angles: this.#prevAnchorsPosition?.angles,
        };
    }

    /**
     * @public
     */
    setAnchorsCoordinates(anchorsCoordinates: IAnchorsCoordinates) {
        this.#prevAnchorsPosition.start = anchorsCoordinates.start;
        this.#prevAnchorsPosition.control = anchorsCoordinates.control;
        this.#prevAnchorsPosition.end = anchorsCoordinates.end;
        this.#anchors.start.setPosition(anchorsCoordinates.start.x, anchorsCoordinates.start.y);
        this.#anchors.control.setPosition(anchorsCoordinates.control.x, anchorsCoordinates.control.y);
        this.#anchors.end.setPosition(anchorsCoordinates.end.x, anchorsCoordinates.end.y);
    }

    // See explanation of what `delta` is in Anchor.js
    setDelta(x: number, y: number) {
        this.#anchors.start.setDelta(x, y);
        this.#anchors.control.setDelta(x, y);
        this.#anchors.end.setDelta(x, y);
    }

    /**
     * Set `on` callback for the arrow (path and head)
     * @public
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
        this.#anchors.start.destroy();
        this.#anchors.control.destroy();
        this.#anchors.end.destroy();
    }
}

export default AnchorsGroup;
