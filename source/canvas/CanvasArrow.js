import Konva from 'konva';

class CanvasArrow {
    constructor(mainStage) {
        this._stage = mainStage;
        this._curveLayer = null;
        this._lineLayer = null;
        this._anchorLayer = null;
        this._quadLine = null;
        this._quad = null;
    }

    drawCurves() {
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
    }

    updateDottedLines() {
        const q = this._quad;

        const quadLine = this._lineLayer.get('#quadLine')[0];

        quadLine.setPoints([
            q.start.attrs.x,
            q.start.attrs.y,
            q.control.attrs.x,
            q.control.attrs.y,
            q.end.attrs.x,
            q.end.attrs.y,
        ]);

        this._lineLayer.draw();
    }

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

        const arrowInstance = this;

        // add hover styling
        anchor.on('mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
            arrowInstance._anchorLayer.draw();
        });
        anchor.on('mouseout', function() {
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            arrowInstance._anchorLayer.draw();
        });

        anchor.on('dragend', () => {
            this.drawCurves();
            this.updateDottedLines();
        });

        this._anchorLayer.add(anchor);
        return anchor;
    }

    drawArrow() {
        this._lineLayer = new Konva.Layer();
        this._anchorLayer = new Konva.Layer();
        this._curveLayer = new Konva.Layer();

        this._quadLine = new Konva.Line({
            dash: [10, 10, 0, 10],
            strokeWidth: 3,
            stroke: 'black',
            lineCap: 'round',
            id: 'quadLine',
            opacity: 0.3,
            points: [0, 0],
        });

        this._quad = {
            start: this.buildAnchor(60, 30),
            control: this.buildAnchor(240, 110),
            end: this.buildAnchor(80, 160),
        };

        this._lineLayer.add(this._quadLine);

        this._stage.add(this._lineLayer);
        this._stage.add(this._anchorLayer);
        this._stage.add(this._curveLayer);

        this.drawCurves();
        this.updateDottedLines();
    }
}

export default CanvasArrow;
