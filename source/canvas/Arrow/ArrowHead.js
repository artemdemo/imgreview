import Konva from 'konva';

const degToRad = deg => deg * (Math.PI / 180);

const HEAD_LEN = 14;
const HEAD_ANGLE = degToRad(50);

class ArrowHead {
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
    }

    setPoints(pointsArray) {
        this._arrowHead.setPoints(pointsArray);
    }

    draw() {
        this._arrowHead.draw();
    }

    getArrowHead() {
        return this._arrowHead;
    }
}

export default ArrowHead;
