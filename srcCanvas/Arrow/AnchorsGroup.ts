import Konva from 'konva';
import Anchor, { EAnchorType } from './Anchor';
import { TAnchorsPosition, TCoordinate } from './arrowTypes';

class AnchorsGroup {
    static defineAnchors(
        stageSize: { width: number, height: number },
        maxLength: number,
        anchorsPosition?: TAnchorsPosition
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

    private readonly _anchorsPosition: TAnchorsPosition | undefined;
    private _anchors: any;
    private _prevAngle: {
        start: number;
        control: number;
        end: number;
    };
    private _cbMap: any;

    /**
     * @param anchorsPosition {object} - anchor points
     */
    constructor(anchorsPosition?: TAnchorsPosition) {
        this._anchorsPosition = anchorsPosition;
        this._anchors = null;
        this._prevAngle = {
            start: 0,
            control: 0,
            end: Math.PI,
        };

        this._cbMap = new Map();
    }

    calculateControlPos(angleChange: number, centerPos: TCoordinate): TCoordinate {
        const controlPos = this._anchors.control.getPosition();

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
            y: centerPos.y + nextControlPos.y,
        };
    }

    moveStart = () => {
        const startPos = this._anchors.start.getPosition();
        const endPos = this._anchors.end.getPosition();
        const startAngle = AnchorsGroup.getAngle(
            startPos,
            endPos,
        );
        const angleChange = startAngle - this._prevAngle.start;

        const newControlPos = this.calculateControlPos(angleChange, endPos);

        this._anchors.control.setPosition(
            newControlPos.x,
            newControlPos.y,
        );
        this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
        this._prevAngle.start = startAngle;
        this._prevAngle.end = Math.PI + startAngle;
    };

    moveControl = () => {
        this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
    };

    moveEnd = () => {
        const startPos = this._anchors.start.getPosition();
        const endPos = this._anchors.end.getPosition();
        const endAngle = AnchorsGroup.getAngle(
            endPos,
            startPos,
        );
        const angleChange = endAngle - this._prevAngle.end;

        const newControlPos = this.calculateControlPos(angleChange, startPos);

        this._anchors.control.setPosition(
            newControlPos.x,
            newControlPos.y,
        );
        this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
        this._prevAngle.start = Math.PI + endAngle;
        this._prevAngle.end = endAngle;
    };

    onDragEnd = () => {
        this._cbMap.has('dragend') && this._cbMap.get('dragend')();
    };

    /**
     * @public
     * @param isVisible {boolean}
     */
    visible = (isVisible: boolean) => {
        this._anchors.start.visible(isVisible);
        this._anchors.control.visible(isVisible);
        this._anchors.end.visible(isVisible);
        this.draw();
    };

    /**
     * @public
     */
    draw() {
        this._anchors.start.draw();
        this._anchors.control.draw();
        this._anchors.end.draw();
    }

    /**
     * Setting anchors is a different method since I want to separate it from adding to stage.
     * It's important for arrow, since I need defined anchors in order to create ArrowHead,
     * but I want to add anchors only after adding the head.
     * @public
     */
    setAnchors(stageSize, maxLength) {
        this._anchors = AnchorsGroup.defineAnchors(stageSize, maxLength, this._anchorsPosition);

        this._anchors.start.on('dragmove', this.moveStart);
        this._anchors.control.on('dragmove', this.moveControl);
        this._anchors.end.on('dragmove', this.moveEnd);

        this._anchors.start.on('dragend', this.onDragEnd);
        this._anchors.control.on('dragend', this.onDragEnd);
        this._anchors.end.on('dragend', this.onDragEnd);
    }

    /**
     * @public
     */
    addToLayer(layer: Konva.Layer) {
        layer.add(this._anchors.start.getAnchor());
        layer.add(this._anchors.control.getAnchor());
        layer.add(this._anchors.end.getAnchor());
    }

    /**
     * @public
     */
    getPositions(): TAnchorsPosition {
        return {
            start: this._anchors.start.getPosition(),
            control: this._anchors.control.getPosition(),
            end: this._anchors.end.getPosition(),
        };
    }

    /**
     * @public
     */
    setPositions(positions: TAnchorsPosition) {
        this._anchors.start.setPosition(positions.start.x, positions.start.y);
        this._anchors.control.setPosition(positions.control.x, positions.control.y);
        this._anchors.end.setPosition(positions.end.x, positions.end.y);
    }

    // See explanation of what `delta` is in Anchor.js
    setDelta(x: number, y: number) {
        this._anchors.start.setDelta(x, y);
        this._anchors.control.setDelta(x, y);
        this._anchors.end.setDelta(x, y);
    }

    /**
     * Set `on` callback for the arrow (path and head)
     * @public
     * @param key {string}
     * @param cb {function}
     */
    on = (key: string, cb: () => void) => {
        this._cbMap.set(key, cb);
    };

    /**
     * Remove and destroy a node. Kill it forever! You should not reuse node after destroy().
     */
    destroy() {
        this._anchors.start.destroy();
        this._anchors.control.destroy();
        this._anchors.end.destroy();
    }
}

export default AnchorsGroup;
