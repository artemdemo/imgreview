import Konva from 'konva';
import Anchor from './Anchor';

class Arrow {
    constructor(mainStage) {
        this._stage = mainStage;
        this._curveLayer = null;
        this._anchorLayer = null;
        this._anchors = null;
        this._quadPath = null;
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
                strokeWidth: 8,
                data: pathStr,
            });
            this._quadPath.on('mouseover', () => {
                this._anchors.start.visible(true);
                this._anchors.control.visible(true);
                this._anchors.end.visible(true);
                this._anchorLayer.draw();
            });
            this._curveLayer.add(this._quadPath);
        }
        this._quadPath.setData(pathStr);
        this._quadPath.draw();
    };

    updateAnchorsLayer = () => {
        this._anchorLayer.draw();
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

        this._anchors.start.setMouseOverCb(this.updateAnchorsLayer);
        this._anchors.control.setMouseOverCb(this.updateAnchorsLayer);
        this._anchors.end.setMouseOverCb(this.updateAnchorsLayer);

        this._anchors.start.setMouseOutCb(this.updateAnchorsLayer);
        this._anchors.control.setMouseOutCb(this.updateAnchorsLayer);
        this._anchors.end.setMouseOutCb(this.updateAnchorsLayer);

        this._anchorLayer.add(this._anchors.start.getAnchor());
        this._anchorLayer.add(this._anchors.control.getAnchor());
        this._anchorLayer.add(this._anchors.end.getAnchor());

        this.drawArrow();

        this._stage.add(this._curveLayer);
        this._stage.add(this._anchorLayer);

    }
}

export default Arrow;
