import Konva from 'konva';
import _get from 'lodash/get';
import { TScaleFactor } from '../Shape/Shape';
import GeometricShape from '../Shape/GeometricShape';
import AnchorsGroup from './AnchorsGroup';
import ArrowHead from './ArrowHead';
import { IAnchorsPosition } from './arrowTypes';
import * as api from '../api';

type TArrowProps = {
    stroke: string;
    strokeWidth?: number;
    anchorsPosition?: IAnchorsPosition;
};

const STROKE_WIDTH = 5;
const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow implements GeometricShape {
    isSelected: boolean = false;

    readonly #props: TArrowProps;
    #shapesLayer: Konva.Layer;
    #anchorsGroup: AnchorsGroup;
    #quadPath: Konva.Path;
    #arrowHead: ArrowHead;
    #cbMap: any;

    /**
     * Arrow constructor
     * @param props {object}
     * @param props.stroke {string} - stroke color
     * @param props.strokeWidth {number} - stroke width
     * @param props.anchorsPosition {object} - anchor points
     */
    constructor(props: TArrowProps) {
        this.#props = {...props};
        this.#cbMap = new Map();
    }

    /**
     * @public
     */
    blur = () => {
        this.#anchorsGroup.visible(false);
        this.redrawArrow();
        this.isSelected = false;
    };

    /**
     * @public
     */
    focus() {
        this.#anchorsGroup.visible(true);
        this.redrawArrow();
        this.isSelected = true;
    }

    /**
     * Set `on` callback for the arrow (path and head)
     * @param key {string}
     * @param cb {function}
     * @public
     */
    on = (key: string, cb) => {
        this.#cbMap.set(key, cb);
    };

    /**
     * Set `on` callback for each anchor
     * @param key {string}
     * @param cb {function}
     * @public
     */
    onAnchor = (key, cb) => {
        this.#anchorsGroup.on(key, cb);
    };

    private onClick = (e) => {
        api.shapeClicked(this);
        this.#anchorsGroup.visible(true);
        e.cancelBubble = true;
        this.isSelected = true;
        this.#cbMap.has('click') && this.#cbMap.get('click')(this);
    };

    private onDragStart = () => {
        this.#anchorsGroup.visible(true);
        this.isSelected = true;
        this.#cbMap.has('dragstart') && this.#cbMap.get('dragstart')(this);
    };

    private onDragEnd = () => {
        this.#anchorsGroup.draw();
    };

    private initArrowDraw(pathStr) {
        this.#quadPath = new Konva.Path({
            stroke: this.#props.stroke || STROKE_COLOR,
            strokeWidth: this.#props.strokeWidth || STROKE_WIDTH,
            data: pathStr,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: true,
        });
        this.#quadPath.on('click', this.onClick);
        this.#quadPath.on('dragmove', this.pathMove);
        this.#quadPath.on('dragstart', this.onDragStart);
        this.#quadPath.on('dragend', this.onDragEnd);
        this.#quadPath.on('mouseover', () => this.#cbMap.has('mouseover') && this.#cbMap.get('mouseover')());
        this.#quadPath.on('mouseout', () => this.#cbMap.has('mouseout') && this.#cbMap.get('mouseout')());
        this.#shapesLayer.add(this.#quadPath);
    }

    private getPathString(anchorsPosition) {
        const qPathX = _get(this.#quadPath, 'attrs.x', 0);
        const qPathY = _get(this.#quadPath, 'attrs.y', 0);

        return `M${anchorsPosition.start.x - qPathX},${anchorsPosition.start.y - qPathY} ` +
            `Q${anchorsPosition.control.x - qPathX},${anchorsPosition.control.y - qPathY} ` +
            `${anchorsPosition.end.x - qPathX},${anchorsPosition.end.y - qPathY}`;
    }

    private redrawArrow = () => {
        const anchorsPosition = this.#anchorsGroup.getPositions();
        const pathStr = this.getPathString(anchorsPosition);

        this.#quadPath.setData(pathStr);

        this.#arrowHead.update(
            anchorsPosition.start,
            anchorsPosition.control,
        );
        this.#shapesLayer.draw();
    };

    private pathMove = () => {
        const qPathX = this.#quadPath.attrs.x;
        const qPathY = this.#quadPath.attrs.y;

        this.#anchorsGroup.setDelta(qPathX, qPathY);

        this.#arrowHead.setDelta(qPathX, qPathY);

        this.#arrowHead.draw();
        this.#anchorsGroup.draw();
    };

    /**
     * Add to layer
     * @public
     */
    addToLayer(layer: Konva.Layer) {
        this.#shapesLayer = layer;

        this.#anchorsGroup = new AnchorsGroup(this.#props.anchorsPosition);

        // First I'm defining anchors in order to use them for creating the ArrowHead
        this.#anchorsGroup.setAnchors({
            width: layer.parent.attrs.width,
            height: layer.parent.attrs.height,
        }, MAX_ARROW_LEN);
        this.#anchorsGroup.on('dragmove', this.redrawArrow);
        this.#anchorsGroup.on('dragend', this.redrawArrow);

        const anchorsPosition = this.#anchorsGroup.getPositions();
        this.#arrowHead = new ArrowHead({
            start: anchorsPosition.start,
            control: anchorsPosition.control,
            stroke: this.#props.stroke || STROKE_COLOR,
            strokeWidth: this.#props.strokeWidth || STROKE_WIDTH,
        });
        this.#arrowHead.on('click', this.onClick);

        const pathStr = this.getPathString(anchorsPosition);
        this.initArrowDraw(pathStr);

        this.#arrowHead.addToLayer(this.#shapesLayer);
        this.#anchorsGroup.addToLayer(this.#shapesLayer);

        this.redrawArrow();
    }

    /**
     * Set color of the arrow
     * @param hex {string}
     * @public
     */
    setStrokeColor(hex: string) {
        this.#quadPath.setAttr('stroke', hex);
        this.#arrowHead.setAttr('stroke', hex);

        // Updating props, I'll need it if user will clone Arrow
        this.#props.stroke = hex;

        this.#quadPath.draw();
        this.#arrowHead.draw();
        this.#anchorsGroup.draw();
    }

    /**
     * @public
     */
    getStrokeColor() {
        return this.#props.stroke;
    }

    /**
     * Set width of the arrow
     * @param width {number}
     * @public
     */
    setStrokeWidth(width: number) {
        this.#quadPath.setAttr('strokeWidth', width);
        this.#arrowHead.setAttr('strokeWidth', width);

        // Updating props, I'll need it if user will clone Arrow
        this.#props.strokeWidth = width;

        this.#shapesLayer.draw();
    }

    /**
     * Scale arrow by given factor
     * @param factor {number}
     * @public
     */
    scale(factor: TScaleFactor) {
        const positions = this.#anchorsGroup.getPositions();
        this.#anchorsGroup.setAnchorsCoordinates({
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
        const anchorsPosition = this.#anchorsGroup ?
            this.#anchorsGroup.getPositions() :
            this.#props.anchorsPosition;
        return new Arrow({
            ...this.#props,
            anchorsPosition,
        });
    }

    /**
     * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
     * @public
     */
    destroy() {
        this.#quadPath.destroy();
        this.#arrowHead.destroy();
        this.#anchorsGroup.destroy();
        this.#shapesLayer.draw();
    }
}

export default Arrow;
