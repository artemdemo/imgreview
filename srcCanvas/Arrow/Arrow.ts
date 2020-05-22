import Konva from "konva";
import _get from "lodash/get";
import { TScaleProps } from "../Shape/IShape";
import IGeometricShape from "../Shape/IGeometricShape";
import AnchorsGroup from "./AnchorsGroup";
import ArrowHead from "./ArrowHead";
import { IAnchorsPosition } from "./arrowTypes";
import * as api from "../api";
import shapeTypes from "../Shape/shapeTypes";

type TArrowProps = {
    stroke: string;
    strokeWidth?: number;
    anchorsPosition?: IAnchorsPosition;
};

const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow implements IGeometricShape {
    readonly type = shapeTypes.ARROW;
    readonly #props: TArrowProps;
    #shapesLayer: Konva.Layer;
    #anchorsGroup: AnchorsGroup;
    // `substratePath` path used to receive mouse events.
    // It's useful for thin paths, when it's hard to "catch" them.
    #substratePath: Konva.Path;
    #visiblePath: Konva.Path;
    #arrowHead: ArrowHead;
    #cbMap: Map<string, (e?: any) => void>;
    #_isSelected: boolean = false;

    constructor(props: TArrowProps) {
        this.#props = {...props};
        this.#cbMap = new Map();
    }

    blur = () => {
        this.#anchorsGroup.visible(false);
        this.redrawArrow();
        this.#_isSelected = false;
    };

    focus() {
        this.#anchorsGroup.visible(true);
        this.redrawArrow();
        this.#_isSelected = true;
    }

    /**
     * Set `on` callback for the arrow (path and head)
     * @param key {string}
     * @param cb {function}
     */
    on = (key: string, cb) => {
        this.#cbMap.set(key, cb);
    };

    /**
     * Set `on` callback for each anchor
     * @param key {string}
     * @param cb {function}
     */
    onAnchor = (key, cb) => {
        this.#anchorsGroup.on(key, cb);
    };

    private onClick = (e) => {
        api.shapeClicked(this);
        this.#anchorsGroup.visible(true);
        e.cancelBubble = true;
        this.#_isSelected = true;
        const clickCb = this.#cbMap.get('click');
        clickCb && clickCb(this);
    };

    private onDragStart = () => {
        this.#anchorsGroup.visible(true);
        this.#_isSelected = true;
        const dragstartCb = this.#cbMap.get('dragstart');
        dragstartCb && dragstartCb(this);
    };

    private onDragEnd = () => {
        this.#anchorsGroup.draw();
    };

    private initArrowDraw(pathStr) {
        this.#substratePath = new Konva.Path({
            data: pathStr,
            stroke: 'transparent',
            strokeWidth: 12,
            draggable: true,
        });
        this.#visiblePath = new Konva.Path({
            data: pathStr,
            stroke: this.#props.stroke || STROKE_COLOR,
            strokeWidth: this.#props.strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
        });
        this.#substratePath.on('click', this.onClick);
        this.#substratePath.on('dragmove', this.pathMove);
        this.#substratePath.on('dragstart', this.onDragStart);
        this.#substratePath.on('dragend', this.onDragEnd);
        this.#substratePath.on('mouseover', () => {
            const mouseoverCb = this.#cbMap.get('mouseover');
            mouseoverCb && mouseoverCb();
        });
        this.#substratePath.on('mouseout', () => {
            const mouseoutCb = this.#cbMap.get('mouseout');
            mouseoutCb && mouseoutCb();
        });
        this.#shapesLayer.add(this.#visiblePath);
        this.#shapesLayer.add(this.#substratePath);
    }

    private getPathString(anchorsPosition) {
        const qPathX = _get(this.#visiblePath, 'attrs.x', 0);
        const qPathY = _get(this.#visiblePath, 'attrs.y', 0);

        return `M${anchorsPosition.start.x - qPathX},${anchorsPosition.start.y - qPathY} ` +
            `Q${anchorsPosition.control.x - qPathX},${anchorsPosition.control.y - qPathY} ` +
            `${anchorsPosition.end.x - qPathX},${anchorsPosition.end.y - qPathY}`;
    }

    private redrawArrow = () => {
        const anchorsPosition = this.#anchorsGroup.getPositions();
        const pathStr = this.getPathString(anchorsPosition);

        this.#visiblePath.setData(pathStr);
        this.#substratePath.setData(pathStr);

        this.#arrowHead.update(
            anchorsPosition.start,
            anchorsPosition.control,
            this.#props.strokeWidth,
        );
        this.#shapesLayer.draw();
    };

    private pathMove = () => {
        const qPathX = this.#substratePath.attrs.x;
        const qPathY = this.#substratePath.attrs.y;

        this.#anchorsGroup.setDelta(qPathX, qPathY);
        this.#visiblePath.setAttrs({
            x: qPathX,
            y: qPathY,
        });
        this.#arrowHead.setDelta(qPathX, qPathY);

        this.#arrowHead.draw();
        this.#anchorsGroup.draw();
    };

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
            strokeWidth: this.#props.strokeWidth,
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
     */
    setStrokeColor(hex: string) {
        this.#visiblePath.setAttr('stroke', hex);
        this.#arrowHead.setAttr('stroke', hex);

        // Updating props, I'll need it if user will clone Arrow
        this.#props.stroke = hex;

        this.#visiblePath.draw();
        this.#arrowHead.draw();
        this.#anchorsGroup.draw();
    }

    getStrokeColor() {
        return this.#props.stroke;
    }

    /**
     * Set width of the arrow
     * @param width {number}
     */
    setStrokeWidth(width: number) {
        this.#visiblePath.setAttr('strokeWidth', width);

        // Updating props, I'll need it if user will clone Arrow
        this.#props.strokeWidth = width;

        this.redrawArrow();
    }

    /**
     * Scale arrow by given factor
     * @param factor {number}
     */
    scale(factor: TScaleProps) {
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

    isSelected(): boolean {
        return this.#_isSelected;
    }

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
     */
    destroy() {
        this.#visiblePath.destroy();
        this.#substratePath.destroy();
        this.#arrowHead.destroy();
        this.#anchorsGroup.destroy();
        this.#shapesLayer.draw();
    }
}

export default Arrow;
