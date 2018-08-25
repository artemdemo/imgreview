import Konva from 'konva';

const degToRad = deg => deg * (Math.PI / 180);

const HEAD_LEN = 14;
const HEAD_ANGLE = degToRad(50);

class ArrowHead {
    // Trigonometry calculation of 3 points of the arrow head
    // See `ArrowHead-schema.jpg` for variables definition
    //
    static calculateHeadPoints(startAnchorPos, controlAnchorPos) {
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

        const rightArmAngle = HEAD_ANGLE - anchorAngle;
        rightArmCoor.x = startAnchorPos.x + (HEAD_LEN * Math.cos(rightArmAngle));
        rightArmCoor.y = startAnchorPos.y - (HEAD_LEN * Math.sin(rightArmAngle));

        const leftArmAngle = degToRad(90) - (anchorAngle + HEAD_ANGLE);
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
            ...props,
        });

        this._onClickCb = null;

        this._arrowHead.on('click', (e) => {
            this._onClickCb && this._onClickCb(e);
        });
    }

    /**
     * Set `onClick` callback.
     * Will be called when user click on the arrowHead.
     * @public
     * @param cb {function}
     */
    setOnClick = (cb) => {
        this._onClickCb = cb;
    };

    setPoints(pointsArray) {
        this._arrowHead.setPoints(pointsArray);
    }

    draw() {
        this._arrowHead.draw();
    }

    getArrowHead() {
        return this._arrowHead;
    }

    setAttr(name, value) {
        this._arrowHead.setAttr(name, value);
    }
}

export default ArrowHead;
