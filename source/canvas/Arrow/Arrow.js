import Konva from 'konva';
import Anchor from './Anchor';
import ArrowHead from './ArrowHead';

const STROKE_WIDTH = 5;
const STROKE_COLOR = 'red';

class Arrow {
    constructor(mainStage) {
        this._stage = mainStage;
        this._curveLayer = null;
        this._anchorLayer = null;
        this._anchors = null;
        this._quadPath = null;
        this._arrowHead = null;

        this._hideTimeout = null;
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
                stroke: STROKE_COLOR,
                strokeWidth: STROKE_WIDTH,
                data: pathStr,
                lineCap: 'round',
                lineJoin: 'round',
            });
            this._quadPath.on('mouseover', () => {
                this._anchors.start.visible(true);
                this._anchors.control.visible(true);
                this._anchors.end.visible(true);
                this._anchorLayer.draw();
            });
            this._quadPath.on('mouseout', this.anchorOut);
            this._curveLayer.add(this._quadPath);

            this._arrowHead = new ArrowHead({
                points: ArrowHead.calculateHeadPoints(
                    this._anchors.start.getPosition(),
                    this._anchors.control.getPosition(),
                ),
                stroke: STROKE_COLOR,
                strokeWidth: STROKE_WIDTH,
            });
            this._curveLayer.add(this._arrowHead.getArrowHead());
        } else {
            this._quadPath.setData(pathStr);
            this._arrowHead.setPoints(
                ArrowHead.calculateHeadPoints(
                    this._anchors.start.getPosition(),
                    this._anchors.control.getPosition(),
                ),
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

        const startX = this._stage.attrs.width / 4;
        const startY = this._stage.attrs.height / 2;

        const controlX = startX * 2;

        const endX = startX * 3;

        this._anchors = {
            start: new Anchor(startX, startY),
            control: new Anchor(controlX, startY),
            end: new Anchor(endX, startY),
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
