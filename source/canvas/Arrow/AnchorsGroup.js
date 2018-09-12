import Konva from 'konva';
import _isNaN from 'lodash/isNaN';
import Anchor from './Anchor';

const radToDeg = rad => rad * (180 / Math.PI);

class AnchorsGroup {
    /**
     * Calculating "Inner product space"
     * @link http://qaru.site/questions/465748/inner-angle-between-two-lines/2019402#2019402
     * @link https://en.wikipedia.org/wiki/Inner_product_space
     * @param prevPos {object}
     * @param newPos {object}
     * @param basePos {object}
     * @return {number} in radians
     */
    static getAngle(prevPos, newPos, basePos) {
        const deltaXA = prevPos.x - basePos.x;
        const deltaXB = newPos.x - basePos.x;
        const deltaYA = prevPos.y - basePos.y;
        const deltaYB = newPos.y - basePos.y;
        const lenA = Math.sqrt((deltaXA ** 2) + (deltaYA ** 2));
        const lenB = Math.sqrt((deltaXB ** 2) + (deltaYB ** 2));
        const nominator = (deltaXA * deltaXB) + (deltaYA * deltaYB);
        const denominator = lenA * lenB;
        const angleDirection = (() => {
            const mainPosDiff = prevPos.y - newPos.y;
            const basePosDiffX = basePos.x - newPos.x;
            const basePosDiffY = newPos.y - basePos.y;

            // const rightTop = basePosDiffX < 0 && basePosDiffY < 0;
            // const rightBottom = basePosDiffX < 0 && basePosDiffY > 0;

            if (basePosDiffX < 0) {
                return mainPosDiff > 0 ? -1 : 1;
            }

            return mainPosDiff < 0 ? -1 : 1;
        })();
        if (denominator === 0) {
            return 0;
        }
        const angle = Math.acos(nominator / denominator);
        return angleDirection * angle;
    }

    constructor() {
        this._anchorLayer = null;
        this._anchors = null;
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
                const angle = AnchorsGroup.getAngle(
                    this._prevPosition.start,
                    startPos,
                    endPos,
                );
                const controlPos = this._anchors.control.getPosition();

                // control position in new coordinate system
                const currentControlPos = {
                    x: controlPos.x - endPos.x,
                    y: controlPos.y - endPos.y,
                };
                const cosAngle = Math.cos(angle);
                const sinAngle = Math.sin(angle);
                const nextControlPos = (() => {
                    if (!_isNaN(cosAngle) && !_isNaN(sinAngle)) {
                        return {
                            x: (currentControlPos.x * cosAngle) - (currentControlPos.y * sinAngle),
                            y: (currentControlPos.y * cosAngle) + (currentControlPos.x * sinAngle),
                        };
                    }
                    return currentControlPos;
                })();
                const newControlPos = {
                    x: nextControlPos.x + endPos.x,
                    y: endPos.y + nextControlPos.y,
                };
                this._anchors.control.setPosition(
                    newControlPos.x,
                    newControlPos.y,
                );
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
                this._prevPosition.start = startPos;
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
                const position = this._anchors.end.getPosition();
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
                this._prevPosition.end = position;
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
