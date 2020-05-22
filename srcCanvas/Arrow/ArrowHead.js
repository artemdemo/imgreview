import Konva from 'konva/konva';

const degToRad = deg => deg * (Math.PI / 180);

const HEAD_LEN = 14;
const MAX_HEAD_ANGLE = 50;

class ArrowHead {
    // Trigonometry calculation of 3 points of the arrow head
    // See `ArrowHead-schema.jpg` for variables definition
    //
    static calculateHeadPoints(startAnchorPos, controlAnchorPos, strokeWidth) {
        const rightArmCoor = {x: 0, y: 0};
        const leftArmCoor = {x: 0, y: 0};

        let anchorAngle;
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

        const headAngle = strokeWidth * 10
        const headAngleRad = degToRad(Math.min(MAX_HEAD_ANGLE, headAngle < 20 ? 20 : headAngle));

        const rightArmAngle = headAngleRad - anchorAngle;
        rightArmCoor.x = startAnchorPos.x + (HEAD_LEN * Math.cos(rightArmAngle));
        rightArmCoor.y = startAnchorPos.y - (HEAD_LEN * Math.sin(rightArmAngle));

        const leftArmAngle = degToRad(90) - (anchorAngle + headAngleRad);
        leftArmCoor.x = startAnchorPos.x + (HEAD_LEN * Math.sin(leftArmAngle));
        leftArmCoor.y = startAnchorPos.y + (HEAD_LEN * Math.cos(leftArmAngle));

        return [
            leftArmCoor.x,
            leftArmCoor.y,
            startAnchorPos.x,
            startAnchorPos.y,
            rightArmCoor.x,
            rightArmCoor.y,
        ];
    }

    constructor(props) {
        this._arrowHead = new Konva.Line({
            lineCap: 'round',
            lineJoin: 'round',
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            points: ArrowHead.calculateHeadPoints(props.start, props.control, props.strokeWidth),
        });

        this._cbMap = new Map();

        this._arrowHead.on('click', (e) => {
            if (this._cbMap.has('click')) {
                this._cbMap.get('click')(e);
            }
        });
        this._arrowHead.on('mouseover', (e) => {
            if (this._cbMap.has('mouseover')) {
                this._cbMap.get('mouseover')(e);
            }
        });
        this._arrowHead.on('mouseout', (e) => {
            if (this._cbMap.has('mouseout')) {
                this._cbMap.get('mouseout')(e);
            }
        });

        this.delta = {x: 0, y: 0};
        this.appliedDelta = {x: 0, y: 0};
    }

    /**
     * Set callback
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this._cbMap.set(key, cb);
    };

    /**
     * @public
     */
    update(startAnchorPos, controlAnchorPos, strokeWidth) {
        this._arrowHead.setPoints(
            ArrowHead.calculateHeadPoints(
                startAnchorPos,
                controlAnchorPos,
                strokeWidth,
            ),
        );
        this._arrowHead.setAttr('x', 0);
        this._arrowHead.setAttr('y', 0);
        this._arrowHead.setAttr('strokeWidth', strokeWidth);
        this._arrowHead.draw();

        this.appliedDelta.x = this.delta.x;
        this.appliedDelta.y = this.delta.y;
    }

    draw() {
        this._arrowHead.draw();
    }

    setDelta(deltaX = 0, deltaY = 0) {
        this._arrowHead.setAttr('x', deltaX - this.appliedDelta.x);
        this._arrowHead.setAttr('y', deltaY - this.appliedDelta.y);
        this.delta.x = deltaX;
        this.delta.y = deltaY;
    }

    setAttr(name, value) {
        this._arrowHead.setAttr(name, value);
    }

    /**
     * @public
     */
    addToLayer(layer) {
        layer.add(this._arrowHead);
    }

    /**
     * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
     */
    destroy() {
        this._arrowHead.destroy();
    }
}

export default ArrowHead;
