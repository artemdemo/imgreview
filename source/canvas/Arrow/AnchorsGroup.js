import Konva from 'konva';
import Anchor from './Anchor';

const radToDeg = rad => rad * (180 / Math.PI);

class AnchorsGroup {
    /**
     * Calculating "Inner product space"
     * @link http://qaru.site/questions/465748/inner-angle-between-two-lines/2019402#2019402
     * @link https://en.wikipedia.org/wiki/Inner_product_space
     * @param newPos {object}
     * @param centerPos {object} center of the rotation
     * @return {number} in radians
     */
    static getAngle(newPos, centerPos) {
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

    constructor() {
        this._anchorLayer = null;
        this._anchors = null;
        this._prevAngle = {
            start: 0,
            control: 0,
            end: Math.PI,
        };
        this._prevPosition = {
            start: { x: 0, y: 0 },
            control: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
        };

        this._cbMap = new Map();
    }

    defineAnchors(stage, maxLength) {
        let startX = stage.attrs.width / 4;
        const startY = stage.attrs.height / 2;

        const controlX = stage.attrs.width / 2;

        let endX = startX * 3;

        if (Math.abs(endX - startX) > maxLength) {
            startX = controlX - (maxLength / 2);
            endX = controlX + (maxLength / 2);
        }

        this._prevPosition.start.x = startX;
        this._prevPosition.start.y = startY;
        this._prevPosition.control.x = controlX;
        this._prevPosition.control.y = startY;
        this._prevPosition.end.x = endX;
        this._prevPosition.end.y = startY;

        return {
            start: new Anchor(startX, startY),
            control: new Anchor(controlX, startY),
            end: new Anchor(endX, startY),
        };
    }

    /**
     * @public
     * @param isVisible {boolean}
     */
    visible = (isVisible) => {
        this._anchors.start.visible(isVisible);
        this._anchors.control.visible(isVisible);
        this._anchors.end.visible(isVisible);
        this.draw();
    };

    /**
     * @public
     */
    draw() {
        this._anchorLayer.draw();
    }

    calculateControlPos(angleChange, centerPos) {
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

    /**
     * @public
     */
    addToStage(stage, maxLength) {
        this._anchorLayer = new Konva.Layer();
        this._anchors = this.defineAnchors(stage, maxLength);

        this._anchors.start.on(
            'dragmove',
            () => {
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
            },
        );
        this._anchors.control.on(
            'dragmove',
            () => {
                const position = this._anchors.control.getPosition();
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
                this._prevPosition.control = position;
            },
        );
        this._anchors.end.on(
            'dragmove',
            () => {
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
                this._prevAngle.end = endAngle;
            },
        );

        this._anchorLayer.add(this._anchors.start.getAnchor());
        this._anchorLayer.add(this._anchors.control.getAnchor());
        this._anchorLayer.add(this._anchors.end.getAnchor());

        stage.add(this._anchorLayer);
    }

    /**
     * @public
     */
    getPosition() {
        return {
            start: this._anchors.start.getPosition(),
            control: this._anchors.control.getPosition(),
            end: this._anchors.end.getPosition(),
        };
    }

    // See explanation of what `delta` is in Anchor.js
    setDelta(x, y) {
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
    on = (key, cb) => {
        this._cbMap.set(key, cb);
    };
}

export default AnchorsGroup;
