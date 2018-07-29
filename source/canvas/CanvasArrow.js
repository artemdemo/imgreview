import Konva from 'konva';
import _throttle from 'lodash/throttle';

class CanvasArrow {
    constructor(mainStage) {
        this._stage = mainStage;
        this._curveLayer = null;
        this._anchorLayer = null;
        this._quad = null;
    }

    drawArrow = () => {
        const context = this._curveLayer.getContext();

        context.clear();

        // draw quad
        context.beginPath();
        context.moveTo(
            this._quad.start.attrs.x,
            this._quad.start.attrs.y,
        );
        context.quadraticCurveTo(
            this._quad.control.attrs.x,
            this._quad.control.attrs.y,
            this._quad.end.attrs.x,
            this._quad.end.attrs.y,
        );
        context.setAttr('strokeStyle', 'red');
        context.setAttr('lineWidth', 4);
        context.stroke();
    };

    buildAnchor(x, y) {
        const anchor = new Konva.Circle({
            x,
            y,
            radius: 20,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            draggable: true,
        });

        const self = this;

        // add hover styling
        anchor.on('mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
            self._anchorLayer.draw();
        });
        anchor.on('mouseout', function() {
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            self._anchorLayer.draw();
        });

        anchor.on('dragend', this.drawArrow);

        anchor.on('dragmove', _throttle(this.drawArrow, 50));

        this._anchorLayer.add(anchor);
        return anchor;
    }

    addArrow() {
        this._anchorLayer = new Konva.Layer();
        this._curveLayer = new Konva.Layer();

        this._quad = {
            start: this.buildAnchor(60, 30),
            control: this.buildAnchor(240, 110),
            end: this.buildAnchor(80, 160),
        };

        this._stage.add(this._curveLayer);
        this._stage.add(this._anchorLayer);

        this.drawArrow();
    }
}

export default CanvasArrow;
