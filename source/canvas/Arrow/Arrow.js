import Konva from 'konva';
import _get from 'lodash/get';
import Anchor from './Anchor';
import ArrowHead from './ArrowHead';

const STROKE_WIDTH = 5;
const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow {
    static defineAnchors(stage) {
        let startX = stage.attrs.width / 4;
        const startY = stage.attrs.height / 2;

        const controlX = stage.attrs.width / 2;

        let endX = startX * 3;

        if (Math.abs(endX - startX) > MAX_ARROW_LEN) {
            startX = controlX - (MAX_ARROW_LEN / 2);
            endX = controlX + (MAX_ARROW_LEN / 2);
        }

        return {
            start: new Anchor(startX, startY),
            control: new Anchor(controlX, startY),
            end: new Anchor(endX, startY),
        };
    }

    /**
     * Arrow constructor
     * @param props {object}
     * @param props.stroke {string} - stroke color
     * @param props.strokeWidth {string} - stroke width
     */
    constructor(props) {
        this._props = props;
        this._curveLayer = null;
        this._anchorLayer = null;
        this._anchors = null;
        this._quadPath = null;
        this._arrowHead = null;
        this.isSelected = false;

        this._cbMap = new Map();
    }

    /**
     * @public
     */
    clearFocus = () => {
        this._anchors.start.visible(false);
        this._anchors.control.visible(false);
        this._anchors.end.visible(false);
        this._anchorLayer.draw();
        this.isSelected = false;
    };

    /**
     * Set `on` callback for the arrow (path and head)
     * @public
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this._cbMap.set(key, cb);
    };

    /**
     * Set `on` callback for each anchor
     * @public
     * @param key {string}
     * @param cb {function}
     */
    onAnchor = (key, cb) => {
        this._anchors.start.on(key, cb);
        this._anchors.control.on(key, cb);
        this._anchors.end.on(key, cb);
    };

    onClick = (e) => {
        this._anchors.start.visible(true);
        this._anchors.control.visible(true);
        this._anchors.end.visible(true);
        this._anchorLayer.draw();
        e.cancelBubble = true;
        this.isSelected = true;
        this._cbMap.has('click') && this._cbMap.get('click')(this);
    };

    drawArrow = () => {
        this._curveLayer.clear();

        const startAnchorPos = this._anchors.start.getPosition();
        const controlAnchorPos = this._anchors.control.getPosition();
        const endAnchorPos = this._anchors.end.getPosition();

        const qPathX = _get(this._quadPath, 'attrs.x', 0);
        const qPathY = _get(this._quadPath, 'attrs.y', 0);

        const pathStr = `M${startAnchorPos.x - qPathX},${startAnchorPos.y - qPathY} ` +
            `Q${controlAnchorPos.x - qPathX},${controlAnchorPos.y - qPathY} ` +
            `${endAnchorPos.x - qPathX},${endAnchorPos.y - qPathY}`;

        if (!this._quadPath) {
            this._quadPath = new Konva.Path({
                stroke: this._props.stroke || STROKE_COLOR,
                strokeWidth: this._props.strokeWidth || STROKE_WIDTH,
                data: pathStr,
                lineCap: 'round',
                lineJoin: 'round',
                draggable: true,
            });
            this._quadPath.on('click', this.onClick);
            this._quadPath.on('dragmove', this.pathMove);
            this._quadPath.on('dragend', this.drawArrow);
            this._quadPath.on('mouseover', () => this._cbMap.has('mouseover') && this._cbMap.get('mouseover')());
            this._quadPath.on('mouseout', () => this._cbMap.has('mouseout') && this._cbMap.get('mouseout')());
            this._curveLayer.add(this._quadPath);

            this._arrowHead = new ArrowHead({
                points: ArrowHead.calculateHeadPoints(
                    this._anchors.start.getPosition(),
                    this._anchors.control.getPosition(),
                ),
                stroke: this._props.stroke || STROKE_COLOR,
                strokeWidth: this._props.strokeWidth || STROKE_WIDTH,
            });
            this._arrowHead.on('click', this.onClick);
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

    pathMove = () => {
        const qPathX = this._quadPath.attrs.x;
        const qPathY = this._quadPath.attrs.y;

        const startPos = this._anchors.start.getPosition();

        this._anchors.start.setDelta(qPathX, qPathY);
        this._anchors.control.setDelta(qPathX, qPathY);
        this._anchors.end.setDelta(qPathX, qPathY);


        const controlPos = this._anchors.control.getPosition();
        this._arrowHead.setPoints(
            ArrowHead.calculateHeadPoints(
                startPos,
                controlPos,
            ),
        );

        this._arrowHead.draw();
        this._anchorLayer.draw();
    };

    addToStage(stage) {
        this._anchorLayer = new Konva.Layer();
        this._curveLayer = new Konva.Layer();

        this._anchors = Arrow.defineAnchors(stage);

        this._anchors.start.on('dragmove', this.drawArrow);
        this._anchors.control.on('dragmove', this.drawArrow);
        this._anchors.end.on('dragmove', this.drawArrow);

        this._anchorLayer.add(this._anchors.start.getAnchor());
        this._anchorLayer.add(this._anchors.control.getAnchor());
        this._anchorLayer.add(this._anchors.end.getAnchor());

        this.drawArrow();

        stage.add(this._curveLayer);
        stage.add(this._anchorLayer);
    }

    /**
     * Set color of the arrow
     * @param hex {string}
     */
    setStroke(hex) {
        this._quadPath.setAttr('stroke', hex);
        this._arrowHead.setAttr('stroke', hex);

        this._quadPath.draw();
        this._arrowHead.draw();
    }
}

export default Arrow;
