import Konva from 'konva';
import Anchor from './Anchor';

const degToRad = deg => deg * (Math.PI / 180);

const STROKE_WIDTH = 8;

const HEAD_LEN = 20;
const HEAD_ANGLE = degToRad(30);


class Arrow {
    constructor(mainStage) {
        this._stage = mainStage;
        this._curveLayer = null;
        this._anchorLayer = null;
        this._anchors = null;
        this._quadPath = null;
        // this._arrowHead = null;

        this._hideTimeout = null;
    }

    calculateHeadPoints() {
        const rightArmCoor = {x: 0, y: 0};
        const leftArmCoor = {x: 0, y: 0};
        const startAnchorPos = this._anchors.start.getPosition();
        const controlAnchorPos = this._anchors.control.getPosition();

        let anchorAngle;
        const anchorXdiff = startAnchorPos.x - controlAnchorPos.x;
        const anchorYdiff = startAnchorPos.y - controlAnchorPos.y;

        if (anchorXdiff === 0) {
            anchorAngle = degToRad(90);
        } else {
            anchorAngle = Math.atan(Math.abs(anchorYdiff / anchorXdiff));
        }

        const rightArmAngle = HEAD_ANGLE - anchorAngle;
        rightArmCoor.x = startAnchorPos.x + (HEAD_LEN * Math.cos(rightArmAngle));
        rightArmCoor.y = startAnchorPos.y - (HEAD_LEN * Math.sin(rightArmAngle));

        const leftArmAngle = degToRad(90) - (anchorAngle + HEAD_ANGLE);
        leftArmCoor.x = startAnchorPos.x + (HEAD_LEN * Math.sin(leftArmAngle));
        leftArmCoor.y = startAnchorPos.y + (HEAD_LEN * Math.cos(leftArmAngle));

        return {
            rightArmCoor,
            leftArmCoor,
        };
    }

    drawArrow = () => {
        this._curveLayer.clear();

        const startAnchorPos = this._anchors.start.getPosition();
        const controlAnchorPos = this._anchors.control.getPosition();
        const endAnchorPos = this._anchors.end.getPosition();

        const pathStr = `M${startAnchorPos.x},${startAnchorPos.y} ` +
            `Q${controlAnchorPos.x},${controlAnchorPos.y} ` +
            `${endAnchorPos.x},${endAnchorPos.y}`;

        if (!this._quadPath) {
            this._quadPath = new Konva.Path({
                stroke: 'red',
                strokeWidth: STROKE_WIDTH,
                data: pathStr,
            });
            this._quadPath.on('mouseover', () => {
                this._anchors.start.visible(true);
                this._anchors.control.visible(true);
                this._anchors.end.visible(true);
                this._anchorLayer.draw();
            });
            this._quadPath.on('mouseout', this.anchorOut);
            this._curveLayer.add(this._quadPath);

            const headPoints = this.calculateHeadPoints();

            this._arrowHead = new Konva.Line({
                points: [
                    headPoints.leftArmCoor.x,
                    headPoints.leftArmCoor.y,
                    startAnchorPos.x,
                    startAnchorPos.y,
                    headPoints.rightArmCoor.x,
                    headPoints.rightArmCoor.y,
                ],
                stroke: 'blue',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
            });
            this._curveLayer.add(this._arrowHead);
        } else {
            const headPoints = this.calculateHeadPoints();
            this._quadPath.setData(pathStr);
            this._arrowHead.setPoints(
                [
                    headPoints.leftArmCoor.x,
                    headPoints.leftArmCoor.y,
                    startAnchorPos.x,
                    startAnchorPos.y,
                    headPoints.rightArmCoor.x,
                    headPoints.rightArmCoor.y,
                ],
            );
        }

        this._quadPath.draw();
        this._arrowHead.draw();
    };

    anchorOver = () => {
        clearTimeout(this._hideTimeout);
        this._anchorLayer.draw();
    };

    anchorOut = () => {
        clearTimeout(this._hideTimeout);
        this._hideTimeout = setTimeout(() => {
            this._anchors.start.visible(false);
            this._anchors.control.visible(false);
            this._anchors.end.visible(false);
            this._anchorLayer.draw();
        }, 1000);
    };

    addArrow() {
        this._anchorLayer = new Konva.Layer();
        this._curveLayer = new Konva.Layer();

        this._anchors = {
            start: new Anchor(60, 30),
            control: new Anchor(240, 110),
            end: new Anchor(80, 160),
        };

        this._anchors.start.setDragMoveCb(this.drawArrow);
        this._anchors.control.setDragMoveCb(this.drawArrow);
        this._anchors.end.setDragMoveCb(this.drawArrow);

        this._anchors.start.setMouseOverCb(this.anchorOver);
        this._anchors.control.setMouseOverCb(this.anchorOver);
        this._anchors.end.setMouseOverCb(this.anchorOver);

        this._anchors.start.setMouseOutCb(this.anchorOut);
        this._anchors.control.setMouseOutCb(this.anchorOut);
        this._anchors.end.setMouseOutCb(this.anchorOut);

        this._anchorLayer.add(this._anchors.start.getAnchor());
        this._anchorLayer.add(this._anchors.control.getAnchor());
        this._anchorLayer.add(this._anchors.end.getAnchor());

        this.drawArrow();

        this._stage.add(this._curveLayer);
        this._stage.add(this._anchorLayer);

    }
}

export default Arrow;
