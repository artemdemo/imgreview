import Konva from 'konva';
import _get from 'lodash/get';
import Shape, { TScaleFactor } from '../Shape/Shape';
import AnchorsGroup from './AnchorsGroup';
import ArrowHead from './ArrowHead';
import { TAnchorsPosition } from './arrowTypes';

type TArrowProps = {
    stroke?: string;
    strokeWidth?: number;
    anchorsPosition?: TAnchorsPosition;
};

const STROKE_WIDTH = 5;
const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow extends Shape {
    private readonly _props: TArrowProps;
    private _arrowLayer: Konva.Layer;
    private _anchorsGroup: AnchorsGroup;
    private _quadPath: Konva.Path;
    private _arrowHead: ArrowHead;
    private _cbMap: any;

    /**
     * Arrow constructor
     * @param props {object}
     * @param props.stroke {string} - stroke color
     * @param props.strokeWidth {number} - stroke width
     * @param props.anchorsPosition {object} - anchor points
     */
    constructor(props: TArrowProps) {
        super();

        this._props = props;

        this._cbMap = new Map();
    }

    /**
     * @public
     */
    clearFocus = () => {
        super.clearFocus();
        this._anchorsGroup.visible(false);
        this.redrawArrow();
        this.isSelected = false;
    };

    /**
     * @public
     */
    setFocus() {
        super.setFocus();
        this._anchorsGroup.visible(true);
        this.redrawArrow();
        this.isSelected = true;
    }

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

    private onClick = (e) => {
        this._anchorsGroup.visible(true);
        e.cancelBubble = true;
        this.isSelected = true;
        this._cbMap.has('click') && this._cbMap.get('click')(this);
    };

    private onDragStart = () => {
        this._anchorsGroup.visible(true);
        this.isSelected = true;
        this._cbMap.has('dragstart') && this._cbMap.get('dragstart')(this);
    };

    private onDragEnd = () => {
        this._anchorsGroup.draw();
    };

    private initArrowDraw(pathStr) {
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
        this._quadPath.on('dragend', this.onDragEnd);
        this._quadPath.on('mouseover', () => this._cbMap.has('mouseover') && this._cbMap.get('mouseover')());
        this._quadPath.on('mouseout', () => this._cbMap.has('mouseout') && this._cbMap.get('mouseout')());
        this._arrowLayer.add(this._quadPath);
    }

    private getPathString(anchorsPosition) {
        const qPathX = _get(this._quadPath, 'attrs.x', 0);
        const qPathY = _get(this._quadPath, 'attrs.y', 0);

        return `M${anchorsPosition.start.x - qPathX},${anchorsPosition.start.y - qPathY} ` +
            `Q${anchorsPosition.control.x - qPathX},${anchorsPosition.control.y - qPathY} ` +
            `${anchorsPosition.end.x - qPathX},${anchorsPosition.end.y - qPathY}`;
    }

    private redrawArrow = () => {
        this._arrowLayer.clear();

        const anchorsPosition = this._anchorsGroup.getPositions();
        const pathStr = this.getPathString(anchorsPosition);

        this._quadPath.setData(pathStr);

        this._arrowHead.update(
            anchorsPosition.start,
            anchorsPosition.control,
        );
        this._quadPath.draw();
        this._anchorsGroup.draw();
    };

    private pathMove = () => {
        const qPathX = this._quadPath.attrs.x;
        const qPathY = this._quadPath.attrs.y;

        this._anchorsGroup.setDelta(qPathX, qPathY);

        this._arrowHead.setDelta(qPathX, qPathY);

        this._arrowHead.draw();
        this._anchorsGroup.draw();
    };

    /**
     * Add to stage
     * @public
     */
    addToStage(stage) {
        this._arrowLayer = new Konva.Layer();
        stage.add(this._arrowLayer);

        this._anchorsGroup = new AnchorsGroup(this._props.anchorsPosition);

        // First I'm defining anchors in order to use them for creating the ArrowHead
        this._anchorsGroup.setAnchors({
            width: stage.attrs.width,
            height: stage.attrs.height,
        }, MAX_ARROW_LEN);
        this._anchorsGroup.on('dragmove', this.redrawArrow);
        this._anchorsGroup.on('dragend', this.redrawArrow);

        const anchorsPosition = this._anchorsGroup.getPositions();
        this._arrowHead = new ArrowHead({
            start: anchorsPosition.start,
            control: anchorsPosition.control,
            stroke: this._props.stroke || STROKE_COLOR,
            strokeWidth: this._props.strokeWidth || STROKE_WIDTH,
        });
        this._arrowHead.on('click', this.onClick);

        const pathStr = this.getPathString(anchorsPosition);
        this.initArrowDraw(pathStr);

        this._arrowHead.addToLayer(this._arrowLayer);
        this._anchorsGroup.addToLayer(this._arrowLayer);

        this.redrawArrow();
    }

    /**
     * Set color of the arrow
     * @param hex {string}
     */
    setStrokeColor(hex: string) {
        this._quadPath.setAttr('stroke', hex);
        this._arrowHead.setAttr('stroke', hex);

        // Updating props, I'll need it if user will clone Arrow
        this._props.stroke = hex;

        this._quadPath.draw();
        this._arrowHead.draw();
        this._anchorsGroup.draw();
    }

    /**
     * Set width of the arrow
     * @param width {number}
     */
    setStrokeWidth(width: number) {
        // I need to clear layer,
        // otherwise while making arrow smaller user will not see it.
        this._arrowLayer.clear();

        this._quadPath.setAttr('strokeWidth', width);
        this._arrowHead.setAttr('strokeWidth', width);

        // Updating props, I'll need it if user will clone Arrow
        this._props.strokeWidth = width;

        this._quadPath.draw();
        this._arrowHead.draw();
        this._anchorsGroup.draw();
    }

    /**
     * Scale arrow by given factor
     * @param factor {number}
     */
    scale(factor: TScaleFactor) {
        const positions = this._anchorsGroup.getPositions();
        this._anchorsGroup.setPositions({
            start: {
                x: positions.start.x * factor.wFactor,
                y: positions.start.y * factor.hFactor,
            },
            control: {
                x: positions.control.x * factor.wFactor,
                y: positions.control.y * factor.hFactor,
            },
            end: {
                x: positions.end.x * factor.wFactor,
                y: positions.end.y * factor.hFactor,
            },
        });

        this.redrawArrow();
    }

    /**
     * Clone arrow
     * @public
     */
    clone() {
        const anchorsPosition = this._anchorsGroup ?
            this._anchorsGroup.getPositions() :
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
        this._arrowLayer.destroy();
    }
}

export default Arrow;
