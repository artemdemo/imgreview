import Konva from 'konva';
import _get from 'lodash/get';
import AnchorsGroup from './AnchorsGroup';
import ArrowHead from './ArrowHead';

const STROKE_WIDTH = 5;
const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow {
    /**
     * Arrow constructor
     * @param props {object}
     * @param props.stroke {string} - stroke color
     * @param props.strokeWidth {string} - stroke width
     * @param props.anchorsPosition {object} - anchor points
     */
    constructor(props) {
        this._props = props;
        this._curveLayer = null;
        this._anchorsGroup = null;
        this._quadPath = null;
        this._arrowHead = null;
        this.isSelected = false;

        this._cbMap = new Map();
    }

    /**
     * @public
     */
    clearFocus = () => {
        this._anchorsGroup.visible(false);
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
        this._anchorsGroup.on(key, cb);
    };

    onClick = (e) => {
        this._anchorsGroup.visible(true);
        e.cancelBubble = true;
        this.isSelected = true;
        this._cbMap.has('click') && this._cbMap.get('click')(this);
    };

    onDragStart = () => {
        this._anchorsGroup.visible(true);
        this.isSelected = true;
        this._cbMap.has('dragstart') && this._cbMap.get('dragstart')(this);
    };

    initArrowDraw(pathStr) {
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
        this._quadPath.on('dragstart', this.onDragStart);
        this._quadPath.on('mouseover', () => this._cbMap.has('mouseover') && this._cbMap.get('mouseover')());
        this._quadPath.on('mouseout', () => this._cbMap.has('mouseout') && this._cbMap.get('mouseout')());
        this._curveLayer.add(this._quadPath);
    }

    redrawArrow = () => {
        this._curveLayer.clear();

        const anchorsPosition = this._anchorsGroup.getPosition();

        const qPathX = _get(this._quadPath, 'attrs.x', 0);
        const qPathY = _get(this._quadPath, 'attrs.y', 0);

        const pathStr = `M${anchorsPosition.start.x - qPathX},${anchorsPosition.start.y - qPathY} ` +
            `Q${anchorsPosition.control.x - qPathX},${anchorsPosition.control.y - qPathY} ` +
            `${anchorsPosition.end.x - qPathX},${anchorsPosition.end.y - qPathY}`;

        if (!this._quadPath) {
            this.initArrowDraw(pathStr);
        } else {
            this._quadPath.setData(pathStr);
        }

        this._arrowHead.update(
            anchorsPosition.start,
            anchorsPosition.control,
        );
        this._quadPath.draw();
    };

    pathMove = () => {
        const qPathX = this._quadPath.attrs.x;
        const qPathY = this._quadPath.attrs.y;

        this._anchorsGroup.setDelta(qPathX, qPathY);
        this._anchorsGroup.draw();

        this._arrowHead.setDelta(qPathX, qPathY);
        this._arrowHead.draw();
    };

    addToStage(stage) {
        this._curveLayer = new Konva.Layer();
        stage.add(this._curveLayer);

        this._anchorsGroup = new AnchorsGroup(this._props.anchorsPosition);

        // First I'm defining anchors in order to use them for creating the ArrowHead
        this._anchorsGroup.setAnchors(stage, MAX_ARROW_LEN);
        this._anchorsGroup.on('dragmove', this.redrawArrow);

        const anchorsPosition = this._anchorsGroup.getPosition();
        this._arrowHead = new ArrowHead({
            start: anchorsPosition.start,
            control: anchorsPosition.control,
            stroke: this._props.stroke || STROKE_COLOR,
            strokeWidth: this._props.strokeWidth || STROKE_WIDTH,
        });
        this._arrowHead.on('click', this.onClick);
        this._arrowHead.addToLayer(this._curveLayer);

        // I'm adding anchors last since I want them to be rendered above tha whole arrow
        this._anchorsGroup.addToStage(stage);

        this.redrawArrow();
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

    /**
     * Clone arrow
     * @public
     */
    clone() {
        const anchorsPosition = this._anchorsGroup ?
            this._anchorsGroup.getPosition() :
            this._props.anchorsPosition;
        return new Arrow({
            ...this._props,
            anchorsPosition,
        });
    }

    /**
     * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
     * @public
     */
    destroy() {
        this._quadPath.destroy();
        this._arrowHead.destroy();
        this._anchorsGroup.destroy();
        this._curveLayer.destroy();
    }
}

export default Arrow;
